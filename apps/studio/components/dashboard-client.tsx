"use client";

import { useEffect, useMemo, useState } from "react";
import { create } from "zustand";
import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ProjectListItem = {
  appId: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  thumbnail: string;
  thumbnailUrl: string;
  lastRendered: string | null;
  lastRenderedLabel: string;
};

type FilterState = {
  query: string;
  category: string;
  setQuery: (value: string) => void;
  setCategory: (value: string) => void;
};

type MetaDraft = {
  title: string;
  description: string;
  tags: string;
  category: string;
  thumbnail: string;
};

type DevServerState = {
  appId: string;
  pid: number;
  port: number;
  url: string;
  logPath: string;
  startedAt: string;
};

type ForgeStatusPayload = {
  devServers?: DevServerState[];
};

type ForgeDevPayload = {
  message?: string;
  url?: string;
  logPath?: string;
  pid?: number;
  port?: number;
  startedAt?: string;
  alreadyRunning?: boolean;
};

const useStudioFilterStore = create<FilterState>((set) => ({
  query: "",
  category: "all",
  setQuery: (value) => set({ query: value }),
  setCategory: (value) => set({ category: value }),
}));

const cardToneVariants = cva("transition duration-300 hover:-translate-y-1", {
  variants: {
    tone: {
      default: "hover:border-[#f39800]",
      cyan: "hover:border-[#59b9c6]",
      emerald: "hover:border-[#b9d08b]",
      violet: "hover:border-[#7058a3]",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

function getTone(category: string): "default" | "cyan" | "emerald" | "violet" {
  const normalized = category.toLowerCase();
  if (normalized.includes("3d") || normalized.includes("animation")) {
    return "cyan";
  }
  if (normalized.includes("template")) {
    return "violet";
  }
  if (normalized.includes("example")) {
    return "emerald";
  }
  return "default";
}

function toBadgeVariant(tone: "default" | "cyan" | "emerald" | "violet") {
  if (tone === "cyan") return "cyan";
  if (tone === "emerald") return "emerald";
  if (tone === "violet") return "violet";
  return "default";
}

function formatLastRendered(value: string | null): string {
  if (!value) {
    return "未実行 / Never rendered";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

function buildThumbnailUrl(project: {
  appId: string;
  thumbnail: string;
  thumbnailUrl?: string;
}): string {
  if (project.thumbnailUrl) {
    return project.thumbnailUrl;
  }
  return `/api/thumbnail?app=${encodeURIComponent(project.appId)}&file=${encodeURIComponent(project.thumbnail)}`;
}

function toDevServerState(
  appId: string,
  input: Partial<DevServerState>,
): DevServerState | null {
  if (typeof input.pid !== "number" || input.pid <= 0) {
    return null;
  }
  if (typeof input.port !== "number" || input.port <= 0) {
    return null;
  }

  return {
    appId,
    pid: input.pid,
    port: input.port,
    url:
      typeof input.url === "string" && input.url.trim().length > 0
        ? input.url
        : `http://localhost:${input.port}`,
    logPath: typeof input.logPath === "string" ? input.logPath : "",
    startedAt:
      typeof input.startedAt === "string" && input.startedAt.trim().length > 0
        ? input.startedAt
        : new Date().toISOString(),
  };
}

function resolveForgeRank(score: number): string {
  if (score >= 85) {
    return "Master Forge";
  }
  if (score >= 60) {
    return "Spark Builder";
  }
  if (score >= 35) {
    return "Rising Smith";
  }
  return "Warm-up";
}

export function DashboardClient({
  initialProjects,
}: {
  initialProjects: ProjectListItem[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [message, setMessage] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [openEditors, setOpenEditors] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, MetaDraft>>({});
  const [devServers, setDevServers] = useState<Record<string, DevServerState>>(
    {},
  );
  const [statusLoading, setStatusLoading] = useState(true);

  const query = useStudioFilterStore((state) => state.query);
  const category = useStudioFilterStore((state) => state.category);
  const setQuery = useStudioFilterStore((state) => state.setQuery);
  const setCategory = useStudioFilterStore((state) => state.setCategory);

  const categories = useMemo(() => {
    return Array.from(
      new Set(projects.map((project) => project.category)),
    ).sort((a, b) => a.localeCompare(b, "ja"));
  }, [projects]);

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

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const categoryMatch = category === "all" || project.category === category;
      if (!categoryMatch) {
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
    });
  }, [category, projects, query]);

  const activeDevCount = Object.keys(devServers).length;
  const renderedCount = projects.filter(
    (project) => project.lastRendered,
  ).length;
  const forgeScore = Math.min(
    100,
    projects.length * 8 + renderedCount * 14 + activeDevCount * 18,
  );
  const forgeRank = resolveForgeRank(forgeScore);

  const toggleEditor = (project: ProjectListItem) => {
    setOpenEditors((prev) => ({
      ...prev,
      [project.appId]: !prev[project.appId],
    }));
    setDrafts((prev) => {
      if (prev[project.appId]) {
        return prev;
      }
      return {
        ...prev,
        [project.appId]: {
          title: project.title,
          description: project.description,
          tags: project.tags.join(", "),
          category: project.category,
          thumbnail: project.thumbnail,
        },
      };
    });
  };

  const runDev = async (project: ProjectListItem) => {
    const key = `${project.appId}:dev`;
    setBusyKey(key);
    setMessage(null);

    const popup = window.open("", "_blank");
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
      setMessage(payload.message ?? "Dev起動に失敗しました。");
      setBusyKey(null);
      return;
    }

    if (payload.url && popup) {
      popup.location.href = payload.url;
    } else if (payload.url) {
      window.open(payload.url, "_blank");
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
      `${payload.alreadyRunning ? "Dev接続" : "Dev起動"}: ${project.appId}${payload.url ? ` (${payload.url})` : ""}${payload.logPath ? ` / log: ${payload.logPath}` : ""}`,
    );
    setBusyKey(null);
  };

  const stopDev = async (project: ProjectListItem) => {
    const key = `${project.appId}:stop-dev`;
    setBusyKey(key);
    setMessage(null);

    const response = await fetch("/api/forge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId: project.appId, action: "stop-dev" }),
    });
    const payload = (await response.json().catch(() => ({}))) as {
      message?: string;
    };

    setDevServers((prev) => {
      const next = { ...prev };
      delete next[project.appId];
      return next;
    });

    if (response.status === 404) {
      setMessage(`既に停止中: ${project.appId}`);
      setBusyKey(null);
      return;
    }

    if (!response.ok) {
      setMessage(payload.message ?? "Dev停止に失敗しました。");
      setBusyKey(null);
      return;
    }

    setMessage(payload.message ?? `Dev停止: ${project.appId}`);
    setBusyKey(null);
  };

  const openDev = (project: ProjectListItem) => {
    const devServer = devServers[project.appId];
    if (!devServer?.url) {
      setMessage(`Devサーバーが見つかりません: ${project.appId}`);
      return;
    }
    window.open(devServer.url, "_blank");
  };

  const runRender = async (project: ProjectListItem) => {
    const key = `${project.appId}:render`;
    setBusyKey(key);
    setMessage(null);

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
      setMessage(payload.message ?? "Render開始に失敗しました。");
      setBusyKey(null);
      return;
    }

    setMessage(
      `Render開始: ${project.appId}${payload.composition ? ` (${payload.composition})` : ""}${payload.logPath ? ` / log: ${payload.logPath}` : ""}`,
    );
    setBusyKey(null);
  };

  const saveMeta = async (project: ProjectListItem) => {
    const draft = drafts[project.appId];
    if (!draft) {
      return;
    }

    const key = `${project.appId}:save`;
    setBusyKey(key);
    setMessage(null);

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
      setMessage(payload.message ?? "メタ保存に失敗しました。");
      setBusyKey(null);
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
          ),
        };
      }),
    );
    setOpenEditors((prev) => ({ ...prev, [project.appId]: false }));
    setMessage(`メタ保存: ${project.appId}`);
    setBusyKey(null);
  };

  return (
    <main className="forge-shell min-h-screen px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="relative overflow-hidden rounded-[calc(var(--radius-card)+8px)] border border-[color:var(--line-soft)] bg-[color:var(--bg-surface)] px-5 py-6 shadow-[0_18px_46px_rgba(89,185,198,0.18)] sm:px-7 sm:py-7">
          <div className="pointer-events-none absolute -left-14 -top-10 h-40 w-40 rounded-full bg-[var(--accent)]/25 blur-2xl" />
          <div className="pointer-events-none absolute -right-16 top-8 h-44 w-44 rounded-full bg-[var(--accent-strong)]/20 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 right-10 h-20 w-20 rounded-full border border-[var(--line-soft)]" />

          <div className="relative">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-strong)]">
              Remotion Forge Playground
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-strong)] sm:text-4xl">
              作るほど楽しい、作品の鍛冶場
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
              作品管理はここで完結。`Dev起動 / 停止`、`Render`、`Meta編集`
              をカードから一気に回せます。
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="forge-chip">
                <span className="forge-chip-label">Projects</span>
                <strong>{projects.length}</strong>
              </div>
              <div className="forge-chip">
                <span className="forge-chip-label">Live Dev</span>
                <strong>{activeDevCount}</strong>
              </div>
              <div className="forge-chip">
                <span className="forge-chip-label">Rendered</span>
                <strong>{renderedCount}</strong>
              </div>
              <div className="forge-chip">
                <span className="forge-chip-label">Forge Rank</span>
                <strong>{forgeRank}</strong>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[color:var(--line-soft)] bg-[color:var(--bg-card)] p-3">
              <div className="flex items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
                <span>鍛造ゲージ / Forge Meter</span>
                <span>{forgeScore}%</span>
              </div>
              <div className="forge-progress mt-2">
                <span style={{ width: `${forgeScore}%` }} />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="タイトル / タグで絞り込み"
                className="w-full min-w-[220px] flex-1 rounded-xl border border-[color:var(--line-soft)] bg-[color:var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none ring-[color:var(--accent)] transition focus:ring-2"
              />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-xl border border-[color:var(--line-soft)] bg-[color:var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none ring-[color:var(--accent)] transition focus:ring-2"
              >
                <option value="all">全カテゴリ</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl border border-[color:var(--line-soft)] bg-[color:var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] transition hover:bg-white"
              >
                再読み込み
              </button>
            </div>

            <div className="mt-4 text-xs text-[var(--text-secondary)]">
              表示: {filteredProjects.length}/{projects.length} projects
              {statusLoading ? " / dev status syncing..." : ""}
            </div>
            {message ? (
              <div className="mt-3 rounded-xl border border-[#f39800] bg-[#fff4df] px-3 py-2 text-xs text-[#8b5600]">
                {message}
              </div>
            ) : null}
          </div>
        </header>

        {filteredProjects.length === 0 ? (
          <section className="rounded-[var(--radius-card)] border border-dashed border-[color:var(--line-soft)] bg-[color:var(--bg-card)] p-8 text-center">
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              一致する作品がありません
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              フィルタを調整するか、`pnpm create:project`
              で新しい作品を鍛造してください。
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const tone = getTone(project.category);
              const editorOpen = openEditors[project.appId];
              const draft = drafts[project.appId];
              const devServer = devServers[project.appId];
              const isDevRunning = Boolean(devServer);
              const devButtonKey = isDevRunning
                ? `${project.appId}:stop-dev`
                : `${project.appId}:dev`;

              return (
                <Card
                  key={project.appId}
                  className={cn(cardToneVariants({ tone }), "forge-card")}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="relative aspect-video overflow-hidden rounded-t-[var(--radius-card)] border-b border-[color:var(--line-soft)] bg-[#eaf4fc]">
                    <img
                      src={project.thumbnailUrl}
                      alt={`${project.title} thumbnail`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
                    <p className="absolute left-3 top-3 rounded-full border border-white/60 bg-white/72 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#595857]">
                      Spark Card
                    </p>
                  </div>
                  <CardContent>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="line-clamp-1 text-lg font-bold text-[var(--text-primary)]">
                        {project.title}
                      </p>
                      <Badge variant={toBadgeVariant(tone)}>
                        {project.category}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-[var(--text-secondary)]">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.length > 0 ? (
                        project.tags.map((tag) => (
                          <span
                            key={`${project.appId}-${tag}`}
                            className="rounded-full border border-[color:var(--line-soft)] bg-[color:var(--bg-surface)] px-2.5 py-1 text-xs text-[var(--text-secondary)]"
                          >
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[var(--text-secondary)]">
                          タグ未設定 / No tags
                        </span>
                      )}
                    </div>
                    <div className="mt-5 rounded-xl border border-[color:var(--line-soft)] bg-[color:var(--bg-surface)] p-3 text-xs text-[var(--text-secondary)]">
                      <p className="uppercase tracking-[0.18em] text-[10px] text-[var(--accent-strong)]">
                        Last Rendered
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                        {project.lastRenderedLabel}
                      </p>
                      <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
                        App Path: {project.appId}
                      </p>
                    </div>
                    <div className="mt-3 rounded-xl border border-[color:var(--line-soft)] bg-[color:var(--bg-surface)] p-3 text-xs text-[var(--text-secondary)]">
                      <p className="uppercase tracking-[0.18em] text-[10px] text-[var(--accent-strong)]">
                        Dev Server
                      </p>
                      {isDevRunning ? (
                        <>
                          <p className="mt-1 text-sm font-semibold text-[#286f79]">
                            Running on :{devServer?.port}
                          </p>
                          <p className="mt-1 break-all text-[11px]">
                            PID: {devServer?.pid} / Log:{" "}
                            {devServer?.logPath || "(none)"}
                          </p>
                        </>
                      ) : (
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          停止中 / Stopped
                        </p>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <button
                        type="button"
                        onClick={() =>
                          isDevRunning ? stopDev(project) : runDev(project)
                        }
                        disabled={busyKey === devButtonKey}
                        className={cn(
                          "rounded-lg px-2 py-2 text-xs font-semibold transition hover:-translate-y-0.5 disabled:opacity-50",
                          isDevRunning
                            ? "border border-[#f39800] bg-[#fff1e1] text-[#8b5600]"
                            : "border border-[#59b9c6] bg-[#e8f7f9] text-[#286f79]",
                        )}
                      >
                        {isDevRunning ? "Dev停止" : "Dev起動"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openDev(project)}
                        disabled={!isDevRunning}
                        className="rounded-lg border border-[#59b9c6] bg-[#eaf4fc] px-2 py-2 text-xs font-semibold text-[#2f6270] transition hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        Devを開く
                      </button>
                      <button
                        type="button"
                        onClick={() => runRender(project)}
                        disabled={busyKey === `${project.appId}:render`}
                        className="rounded-lg border border-[#b9d08b] bg-[#f2f8e8] px-2 py-2 text-xs font-semibold text-[#536f2a] transition hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        Render
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleEditor(project)}
                        className="rounded-lg border border-[#7058a3] bg-[#efe9f8] px-2 py-2 text-xs font-semibold text-[#4e327f] transition hover:-translate-y-0.5"
                      >
                        {editorOpen ? "閉じる" : "Meta編集"}
                      </button>
                    </div>
                    {editorOpen && draft ? (
                      <div className="mt-4 space-y-2 rounded-xl border border-[color:var(--line-soft)] bg-[#faf9f6] p-3">
                        <input
                          value={draft.title}
                          onChange={(event) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [project.appId]: {
                                ...draft,
                                title: event.target.value,
                              },
                            }))
                          }
                          placeholder="title"
                          className="w-full rounded-lg border border-[color:var(--line-soft)] bg-white px-2 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                        <textarea
                          value={draft.description}
                          onChange={(event) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [project.appId]: {
                                ...draft,
                                description: event.target.value,
                              },
                            }))
                          }
                          placeholder="description"
                          className="h-20 w-full rounded-lg border border-[color:var(--line-soft)] bg-white px-2 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                        <input
                          value={draft.tags}
                          onChange={(event) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [project.appId]: {
                                ...draft,
                                tags: event.target.value,
                              },
                            }))
                          }
                          placeholder="tags (comma separated)"
                          className="w-full rounded-lg border border-[color:var(--line-soft)] bg-white px-2 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                        <input
                          value={draft.category}
                          onChange={(event) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [project.appId]: {
                                ...draft,
                                category: event.target.value,
                              },
                            }))
                          }
                          placeholder="category"
                          className="w-full rounded-lg border border-[color:var(--line-soft)] bg-white px-2 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                        <input
                          value={draft.thumbnail}
                          onChange={(event) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [project.appId]: {
                                ...draft,
                                thumbnail: event.target.value,
                              },
                            }))
                          }
                          placeholder="thumbnail path (e.g. public/thumbnail.svg)"
                          className="w-full rounded-lg border border-[color:var(--line-soft)] bg-white px-2 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                        <button
                          type="button"
                          onClick={() => saveMeta(project)}
                          disabled={busyKey === `${project.appId}:save`}
                          className="w-full rounded-lg border border-[#f39800] bg-[#fff1e1] px-2 py-2 text-xs font-semibold text-[#8b5600] transition hover:-translate-y-0.5 disabled:opacity-50"
                        >
                          保存
                        </button>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
