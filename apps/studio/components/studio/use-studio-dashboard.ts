"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { create } from "zustand";
import { getCopy } from "@/components/studio/copy";
import {
  buildRenderUrl,
  buildThumbnailUrl,
  formatLastRendered,
  getProjectState,
  openUrlWithFallback,
  resolveForgeRank,
  sortProjects,
  toDevServerState,
} from "@/components/studio/helpers";
import type {
  DevServerState,
  FilterState,
  ForgeDevPayload,
  ForgeStatusPayload,
  Language,
  MetaDraft,
  PanelTab,
  PreviewState,
  ProjectListItem,
  ProjectSection,
  RenderAsset,
  RenderListPayload,
} from "@/components/studio/types";

const GUIDE_STORAGE_KEY = "forge-studio:getting-started:dismissed";

const useStudioFilterStore = create<FilterState>((set) => ({
  query: "",
  category: "all",
  status: "all",
  sort: "recent",
  setQuery: (value) => set({ query: value }),
  setCategory: (value) => set({ category: value }),
  setStatus: (value) => set({ status: value }),
  setSort: (value) => set({ sort: value }),
}));

function ensureDraftForProject(project: ProjectListItem): MetaDraft {
  return {
    title: project.title,
    description: project.description,
    tags: project.tags.join(", "),
    category: project.category,
    thumbnail: project.thumbnail,
  };
}

function normalizeSectionProjects(
  projects: ProjectListItem[],
  language: Language,
  sort: FilterState["sort"],
) {
  return sortProjects(projects, sort, language);
}

export function useStudioDashboard(initialProjects: ProjectListItem[]) {
  const [projects, setProjects] = useState(initialProjects);
  const [message, setMessage] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [devServers, setDevServers] = useState<Record<string, DevServerState>>(
    {},
  );
  const [renderAssetsByApp, setRenderAssetsByApp] = useState<
    Record<string, RenderAsset[]>
  >({});
  const [renderLoadingByApp, setRenderLoadingByApp] = useState<
    Record<string, boolean>
  >({});
  const [drafts, setDrafts] = useState<Record<string, MetaDraft>>({});
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [language, setLanguage] = useState<Language>("ja");
  const [statusLoading, setStatusLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [panelTab, setPanelTab] = useState<PanelTab>("renders");
  const [showGuide, setShowGuide] = useState(false);

  const t = getCopy(language);
  const query = useStudioFilterStore((state) => state.query);
  const category = useStudioFilterStore((state) => state.category);
  const status = useStudioFilterStore((state) => state.status);
  const sort = useStudioFilterStore((state) => state.sort);
  const setQuery = useStudioFilterStore((state) => state.setQuery);
  const setCategory = useStudioFilterStore((state) => state.setCategory);
  const setStatus = useStudioFilterStore((state) => state.setStatus);
  const setSort = useStudioFilterStore((state) => state.setSort);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const nextLanguage: Language = navigator.language
      .toLowerCase()
      .startsWith("ja")
      ? "ja"
      : "en";
    setLanguage(nextLanguage);
  }, []);

  useEffect(() => {
    try {
      setShowGuide(window.localStorage.getItem(GUIDE_STORAGE_KEY) !== "1");
    } catch {
      setShowGuide(true);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const syncDevServers = async () => {
      const response = await fetch("/api/forge", {
        method: "GET",
        cache: "no-store",
      }).catch(() => null);
      if (!response || !active) {
        return;
      }

      const payload = (await response
        .json()
        .catch(() => ({}))) as ForgeStatusPayload;
      if (!response.ok || !Array.isArray(payload.devServers)) {
        return;
      }

      const next: Record<string, DevServerState> = {};
      for (const server of payload.devServers) {
        if (!server || typeof server.appId !== "string") {
          continue;
        }
        const normalized = toDevServerState(server.appId, server);
        if (normalized) {
          next[normalized.appId] = normalized;
        }
      }

      if (active) {
        setDevServers(next);
        setStatusLoading(false);
      }
    };

    void syncDevServers();
    const timer = window.setInterval(() => {
      void syncDevServers();
    }, 15000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(projects.map((project) => project.category)),
    ).sort((a, b) => a.localeCompare(b, language === "ja" ? "ja" : "en"));
  }, [language, projects]);

  const projectsWithState = useMemo(() => {
    return projects.map((project) => ({
      project,
      state: getProjectState(project, devServers[project.appId]),
    }));
  }, [devServers, projects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return projectsWithState
      .filter(({ project, state }) => {
        if (category !== "all" && project.category !== category) {
          return false;
        }
        if (status !== "all" && state !== status) {
          return false;
        }
        if (!normalizedQuery) {
          return true;
        }
        const searchable = [
          project.title,
          project.description,
          project.appId,
          project.tags.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return searchable.includes(normalizedQuery);
      })
      .map((item) => item.project);
  }, [category, deferredQuery, projectsWithState, status]);

  const sections = useMemo<ProjectSection[]>(() => {
    const hasManualFiltering =
      Boolean(deferredQuery.trim()) || category !== "all" || status !== "all";

    if (hasManualFiltering) {
      return [
        {
          key: "filtered",
          title: t.sectionFiltered,
          description: t.sectionFilteredBody,
          projects: normalizeSectionProjects(filteredProjects, language, sort),
        },
      ];
    }

    const activeDev = projectsWithState
      .filter((item) => item.state === "active_dev")
      .map((item) => item.project);
    const ready = projectsWithState
      .filter((item) => item.state === "ready_to_watch")
      .map((item) => item.project);
    const needsRender = projectsWithState
      .filter((item) => item.state === "needs_render")
      .map((item) => item.project);
    const template = projectsWithState
      .filter((item) => item.state === "template")
      .map((item) => item.project);

    return [
      {
        key: "active-dev",
        title: t.sectionActiveDev,
        description: t.sectionActiveDevBody,
        projects: normalizeSectionProjects(activeDev, language, sort),
      },
      {
        key: "ready",
        title: t.sectionReady,
        description: t.sectionReadyBody,
        projects: normalizeSectionProjects(ready, language, sort),
      },
      {
        key: "needs-render",
        title: t.sectionNeedsRender,
        description: t.sectionNeedsRenderBody,
        projects: normalizeSectionProjects(needsRender, language, sort),
      },
      {
        key: "template",
        title: t.sectionTemplate,
        description: t.sectionTemplateBody,
        projects: normalizeSectionProjects(template, language, sort),
      },
    ].filter((section) => section.projects.length > 0);
  }, [
    category,
    deferredQuery,
    filteredProjects,
    language,
    projectsWithState,
    sort,
    status,
    t.sectionActiveDev,
    t.sectionActiveDevBody,
    t.sectionFiltered,
    t.sectionFilteredBody,
    t.sectionNeedsRender,
    t.sectionNeedsRenderBody,
    t.sectionReady,
    t.sectionReadyBody,
    t.sectionTemplate,
    t.sectionTemplateBody,
  ]);

  const selectedProject =
    projects.find((item) => item.appId === selectedProjectId) ?? null;
  const selectedProjectState = selectedProject
    ? getProjectState(selectedProject, devServers[selectedProject.appId])
    : null;

  const activeDevCount = Object.keys(devServers).length;
  const renderedCount = projectsWithState.filter(
    ({ state }) => state === "ready_to_watch" || state === "active_dev",
  ).length;
  const forgeScore = Math.min(
    100,
    projects.length * 8 + renderedCount * 14 + activeDevCount * 18,
  );
  const forgeRank = resolveForgeRank(forgeScore);
  const renderedCoverage = projects.length
    ? Math.round((renderedCount / projects.length) * 100)
    : 0;

  const syncRenderAssets = async (
    appId: string,
    options?: { silent?: boolean },
  ): Promise<RenderAsset[] | null> => {
    setRenderLoadingByApp((prev) => ({ ...prev, [appId]: true }));

    const response = await fetch(
      `/api/renders?app=${encodeURIComponent(appId)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    ).catch(() => null);

    if (!response) {
      setRenderLoadingByApp((prev) => ({ ...prev, [appId]: false }));
      if (!options?.silent) {
        setMessage(`${t.msgRenderListFailed}: ${appId}`);
      }
      return null;
    }

    const payload = (await response
      .json()
      .catch(() => ({}))) as RenderListPayload;
    if (!response.ok || !Array.isArray(payload.files)) {
      setRenderLoadingByApp((prev) => ({ ...prev, [appId]: false }));
      if (!options?.silent) {
        setMessage(payload.message ?? `${t.msgRenderListFailed}: ${appId}`);
      }
      return null;
    }

    const files = payload.files ?? [];
    setRenderAssetsByApp((prev) => ({ ...prev, [appId]: files }));
    setProjects((prev) =>
      prev.map((item) => {
        if (item.appId !== appId) {
          return item;
        }
        const latest = files[0];
        const inferredLastRendered = latest?.updatedAt ?? null;
        return {
          ...item,
          renderCount: files.length,
          latestRenderFile: latest?.relativePath ?? null,
          latestRenderAt: latest?.updatedAt ?? null,
          lastRendered: inferredLastRendered,
          lastRenderedLabel: formatLastRendered(inferredLastRendered, language),
        };
      }),
    );
    setRenderLoadingByApp((prev) => ({ ...prev, [appId]: false }));

    if (!options?.silent) {
      setMessage(`${t.msgRenderListUpdated}: ${appId} (${files.length})`);
    }

    return files;
  };

  const openPreview = async (project: ProjectListItem) => {
    const cached = renderAssetsByApp[project.appId] ?? [];
    const firstCached = cached[0];
    if (firstCached) {
      setPreview({
        appId: project.appId,
        title: project.title,
        relativePath: firstCached.relativePath,
        url: firstCached.url,
        updatedAt: firstCached.updatedAt,
        size: firstCached.size,
      });
      return;
    }

    if (project.latestRenderFile) {
      setPreview({
        appId: project.appId,
        title: project.title,
        relativePath: project.latestRenderFile,
        url: buildRenderUrl(project.appId, project.latestRenderFile),
        updatedAt: project.latestRenderAt,
        size: null,
      });
      return;
    }

    const synced = await syncRenderAssets(project.appId, { silent: true });
    const firstSynced = synced?.[0];
    if (firstSynced) {
      setPreview({
        appId: project.appId,
        title: project.title,
        relativePath: firstSynced.relativePath,
        url: firstSynced.url,
        updatedAt: firstSynced.updatedAt,
        size: firstSynced.size,
      });
      return;
    }

    setMessage(`${t.msgNoWatchable}: ${project.appId} (${t.msgCreateRender})`);
  };

  const runDev = async (project: ProjectListItem) => {
    const key = `${project.appId}:dev`;
    setBusyKey(key);
    setMessage(null);

    const popup = window.open("", "_blank");
    try {
      const response = await fetch("/api/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId: project.appId, action: "dev" }),
      });
      const payload = (await response
        .json()
        .catch(() => ({}))) as ForgeDevPayload;

      if (!response.ok) {
        popup?.close();
        setMessage(payload.message ?? t.msgDevStartFailed);
        return;
      }

      if (payload.url && popup) {
        popup.location.href = payload.url;
      } else if (payload.url) {
        window.location.assign(payload.url);
      }

      const nextDevServer = toDevServerState(project.appId, {
        appId: project.appId,
        pid: payload.pid,
        port: payload.port,
        url: payload.url,
        logPath: payload.logPath,
        startedAt: payload.startedAt,
      });
      if (nextDevServer) {
        setDevServers((prev) => ({ ...prev, [project.appId]: nextDevServer }));
      }

      setMessage(
        `${payload.alreadyRunning ? t.msgDevConnect : t.msgDevStarted}: ${project.appId}${payload.url ? ` (${payload.url})` : ""}${payload.logPath ? ` / log: ${payload.logPath}` : ""}`,
      );
    } catch {
      popup?.close();
      setMessage(`${t.msgDevStartRequestFailed}: ${project.appId}`);
    } finally {
      setBusyKey(null);
    }
  };

  const stopDev = async (project: ProjectListItem) => {
    const key = `${project.appId}:stop-dev`;
    setBusyKey(key);
    setMessage(null);

    try {
      const response = await fetch("/api/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId: project.appId, action: "stop-dev" }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (response.status === 404) {
        setDevServers((prev) => {
          const next = { ...prev };
          delete next[project.appId];
          return next;
        });
        setMessage(`${t.msgAlreadyStopped}: ${project.appId}`);
        return;
      }

      if (!response.ok) {
        setMessage(payload.message ?? t.msgDevStopFailed);
        return;
      }

      setDevServers((prev) => {
        const next = { ...prev };
        delete next[project.appId];
        return next;
      });
      setMessage(payload.message ?? `${t.msgDevStopped}: ${project.appId}`);
    } catch {
      setMessage(`${t.msgDevStopRequestFailed}: ${project.appId}`);
    } finally {
      setBusyKey(null);
    }
  };

  const openDev = (project: ProjectListItem) => {
    const devServer = devServers[project.appId];
    if (!devServer?.url) {
      setMessage(`${t.msgDevNotFound}: ${project.appId}`);
      return;
    }
    openUrlWithFallback(devServer.url);
  };

  const runRender = async (project: ProjectListItem) => {
    const key = `${project.appId}:render`;
    setBusyKey(key);
    setMessage(null);

    try {
      const response = await fetch("/api/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId: project.appId, action: "render" }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        composition?: string;
        logPath?: string;
      };

      if (!response.ok) {
        setMessage(payload.message ?? t.msgRenderStartFailed);
        return;
      }

      setMessage(
        `${t.msgRenderStart}: ${project.appId}${payload.composition ? ` (${payload.composition})` : ""}${payload.logPath ? ` / log: ${payload.logPath}` : ""}`,
      );
      window.setTimeout(() => {
        void syncRenderAssets(project.appId, { silent: true });
      }, 4000);
    } catch {
      setMessage(`${t.msgRenderStartRequestFailed}: ${project.appId}`);
    } finally {
      setBusyKey(null);
    }
  };

  const deleteRenderAsset = async (
    project: ProjectListItem,
    asset: RenderAsset,
  ) => {
    if (!window.confirm(`${t.confirmDeleteRender} ${asset.relativePath}`)) {
      return;
    }

    const key = `${project.appId}:delete-render:${asset.relativePath}`;
    setBusyKey(key);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/renders?app=${encodeURIComponent(project.appId)}&file=${encodeURIComponent(asset.relativePath)}`,
        {
          method: "DELETE",
        },
      );
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        setMessage(payload.message ?? t.msgDeleteRenderFailed);
        return;
      }

      if (
        preview &&
        preview.appId === project.appId &&
        preview.relativePath === asset.relativePath
      ) {
        setPreview(null);
      }
      await syncRenderAssets(project.appId, { silent: true });
      setMessage(`${t.msgDeleteRenderDone}: ${asset.fileName}`);
    } catch {
      setMessage(`${t.msgDeleteRenderFailed}: ${asset.fileName}`);
    } finally {
      setBusyKey(null);
    }
  };

  const deleteProject = async (project: ProjectListItem) => {
    if (!window.confirm(`${t.confirmDeleteProject} ${project.appId}`)) {
      return;
    }

    const key = `${project.appId}:delete-project`;
    setBusyKey(key);
    setMessage(null);

    try {
      const response = await fetch("/api/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: project.appId,
          action: "delete-project",
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        setMessage(payload.message ?? t.msgDeleteProjectFailed);
        return;
      }

      setProjects((prev) =>
        prev.filter((item) => item.appId !== project.appId),
      );
      setDevServers((prev) => {
        const next = { ...prev };
        delete next[project.appId];
        return next;
      });
      setRenderAssetsByApp((prev) => {
        const next = { ...prev };
        delete next[project.appId];
        return next;
      });
      setRenderLoadingByApp((prev) => {
        const next = { ...prev };
        delete next[project.appId];
        return next;
      });
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[project.appId];
        return next;
      });
      if (preview?.appId === project.appId) {
        setPreview(null);
      }
      if (selectedProjectId === project.appId) {
        setSelectedProjectId(null);
      }
      setMessage(`${t.msgDeleteProjectDone}: ${project.appId}`);
    } catch {
      setMessage(`${t.msgDeleteProjectFailed}: ${project.appId}`);
    } finally {
      setBusyKey(null);
    }
  };

  const saveMeta = async (project: ProjectListItem) => {
    const draft = drafts[project.appId];
    if (!draft) {
      return;
    }

    const key = `${project.appId}:save`;
    setBusyKey(key);
    setMessage(null);

    try {
      const response = await fetch("/api/project-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: project.appId,
          meta: {
            title: draft.title,
            description: draft.description,
            tags: draft.tags,
            category: draft.category,
            thumbnail: draft.thumbnail,
          },
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        meta?: {
          title: string;
          description: string;
          tags: string[];
          thumbnail: string;
          category: string;
          lastRendered: string | null;
        };
      };

      if (!response.ok || !payload.meta) {
        setMessage(payload.message ?? t.msgMetaSaveFailed);
        return;
      }

      setProjects((prev) =>
        prev.map((item) => {
          if (item.appId !== project.appId) {
            return item;
          }
          return {
            ...item,
            title: payload.meta?.title ?? item.title,
            description: payload.meta?.description ?? item.description,
            tags: payload.meta?.tags ?? item.tags,
            category: payload.meta?.category ?? item.category,
            thumbnail: payload.meta?.thumbnail ?? item.thumbnail,
            thumbnailUrl: buildThumbnailUrl({
              appId: item.appId,
              thumbnail: payload.meta?.thumbnail ?? item.thumbnail,
            }),
            lastRendered: payload.meta?.lastRendered ?? item.lastRendered,
            lastRenderedLabel: formatLastRendered(
              payload.meta?.lastRendered ?? item.lastRendered,
              language,
            ),
          };
        }),
      );
      setMessage(`${t.msgMetaSaved}: ${project.appId}`);
    } catch {
      setMessage(`${t.msgMetaSaveRequestFailed}: ${project.appId}`);
    } finally {
      setBusyKey(null);
    }
  };

  const openControlPanel = (
    project: ProjectListItem,
    tab: PanelTab = "renders",
  ) => {
    setSelectedProjectId(project.appId);
    setPanelTab(tab);
    if (tab === "meta") {
      setDrafts((prev) => ({
        ...prev,
        [project.appId]: prev[project.appId] ?? ensureDraftForProject(project),
      }));
    }
    if (tab === "renders" && !renderAssetsByApp[project.appId]) {
      void syncRenderAssets(project.appId, { silent: true });
    }
  };

  const closeControlPanel = () => {
    setSelectedProjectId(null);
  };

  const dismissGuide = () => {
    setShowGuide(false);
    try {
      window.localStorage.setItem(GUIDE_STORAGE_KEY, "1");
    } catch {
      // Ignore storage failures and keep the current session state only.
    }
  };

  const handlePrimaryAction = async (project: ProjectListItem) => {
    const currentState = getProjectState(project, devServers[project.appId]);
    if (currentState === "ready_to_watch") {
      await openPreview(project);
      return;
    }
    if (currentState === "active_dev") {
      openDev(project);
      return;
    }
    if (currentState === "template") {
      await runDev(project);
      return;
    }
    await runRender(project);
  };

  return {
    projects,
    categories,
    sections,
    filteredProjects,
    query,
    category,
    status,
    sort,
    setQuery,
    setCategory,
    setStatus,
    setSort,
    language,
    setLanguage,
    t,
    message,
    busyKey,
    statusLoading,
    forgeScore,
    forgeRank,
    renderedCoverage,
    activeDevCount,
    renderedCount,
    selectedProject,
    selectedProjectState,
    panelTab,
    setPanelTab,
    showGuide,
    dismissGuide,
    closeControlPanel,
    openControlPanel,
    preview,
    setPreview,
    drafts,
    setDrafts,
    renderAssetsByApp,
    renderLoadingByApp,
    devServers,
    handlePrimaryAction,
    runRender,
    runDev,
    stopDev,
    openDev,
    openPreview,
    syncRenderAssets,
    deleteRenderAsset,
    deleteProject,
    saveMeta,
  };
}
