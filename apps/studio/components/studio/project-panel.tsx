"use client";

import { Badge } from "@/components/ui/badge";
import {
  buildRenderUrl,
  formatFileSize,
  formatLastRendered,
  getPrimaryActionLabel,
  getProjectStateLabel,
  getStateBadgeTone,
} from "@/components/studio/helpers";
import type {
  DevServerState,
  Language,
  MetaDraft,
  PanelTab,
  ProjectListItem,
  ProjectState,
  RenderAsset,
} from "@/components/studio/types";
import { ProjectThumbnail } from "@/components/studio/project-thumbnail";
import { cn } from "@/lib/utils";

export function ProjectPanel({
  project,
  projectState,
  language,
  labels,
  panelTab,
  onTabChange,
  onClose,
  onPrimaryAction,
  onRefreshRenders,
  onOpenPreview,
  onDeleteRender,
  onRunDev,
  onStopDev,
  onOpenDev,
  onSaveMeta,
  onDeleteProject,
  busyKey,
  renderAssets,
  renderLoading,
  devServer,
  draft,
  onDraftChange,
}: {
  project: ProjectListItem | null;
  projectState: ProjectState | null;
  language: Language;
  labels: {
    actionClose: string;
    actionOpenInNewTab: string;
    actionRefreshList: string;
    actionRenderNow: string;
    actionDeleteRender: string;
    actionRunDev: string;
    actionStopDev: string;
    actionOpenDev: string;
    actionSave: string;
    actionDeleteProject: string;
    manageTitle: string;
    manageSubtitle: string;
    panelRenders: string;
    panelDev: string;
    panelMeta: string;
    panelLatestRender: string;
    panelNoRender: string;
    panelRenderBody: string;
    panelDevBody: string;
    panelMetaBody: string;
    panelPreviewStatic: string;
    panelRunningOn: string;
    panelStopped: string;
    panelLog: string;
    panelPid: string;
    panelTitle: string;
    panelDescription: string;
    panelTags: string;
    panelCategory: string;
    panelThumbnail: string;
    placeholderTitle: string;
    placeholderDescription: string;
    placeholderTags: string;
    placeholderCategory: string;
    placeholderThumbnail: string;
  };
  panelTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  onClose: () => void;
  onPrimaryAction: () => void;
  onRefreshRenders: () => void;
  onOpenPreview: (asset: RenderAsset) => void;
  onDeleteRender: (asset: RenderAsset) => void;
  onRunDev: () => void;
  onStopDev: () => void;
  onOpenDev: () => void;
  onSaveMeta: () => void;
  onDeleteProject: () => void;
  busyKey: string | null;
  renderAssets: RenderAsset[];
  renderLoading: boolean;
  devServer?: DevServerState;
  draft?: MetaDraft;
  onDraftChange: (key: keyof MetaDraft, value: string) => void;
}) {
  if (!project || !projectState) {
    return null;
  }

  const latestRenderPath =
    project.latestRenderFile ?? renderAssets[0]?.relativePath ?? null;
  const latestRenderUrl = latestRenderPath
    ? buildRenderUrl(project.appId, latestRenderPath)
    : null;
  const primaryLabel = getPrimaryActionLabel(language, projectState);
  const stateLabel = getProjectStateLabel(language, projectState);
  const isDevRunning = Boolean(devServer);

  return (
    <div
      className="fixed inset-0 z-40 bg-slate-950/42 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col border-l border-white/10 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.98))] shadow-[-30px_0_80px_rgba(15,23,42,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-[color:var(--line-soft)] px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-700/80">
                {labels.manageTitle}
              </p>
              <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[color:var(--text-strong)]">
                {project.title}
              </h2>
              <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
                {labels.manageSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[color:var(--line-soft)] bg-white px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)] transition hover:border-slate-400 hover:text-[color:var(--text-strong)]"
            >
              {labels.actionClose}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant={getStateBadgeTone(projectState)}>
              {stateLabel}
            </Badge>
            <Badge>{project.category}</Badge>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-3xl border border-[color:var(--line-soft)] bg-slate-950">
              {latestRenderUrl ? (
                <video
                  key={latestRenderUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full"
                  src={latestRenderUrl}
                />
              ) : (
                <div className="relative aspect-video">
                  <ProjectThumbnail
                    project={project}
                    className="h-full w-full object-cover opacity-92"
                  />
                  <div className="absolute inset-0 flex items-end bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.48))] p-4">
                    <p className="rounded-full border border-white/15 bg-slate-950/60 px-3 py-1 text-xs font-semibold text-white">
                      {labels.panelPreviewStatic}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl border border-[color:var(--line-soft)] bg-white/70 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700/80">
                  {labels.panelLatestRender}
                </p>
                <p className="mt-2 text-sm font-semibold text-[color:var(--text-strong)]">
                  {formatLastRendered(project.lastRendered, language)}
                </p>
                <p className="mt-2 text-xs text-[color:var(--text-secondary)]">
                  {project.latestRenderFile ?? labels.panelNoRender}
                </p>
              </div>

              <button
                type="button"
                onClick={onPrimaryAction}
                className="w-full rounded-2xl border border-cyan-500/28 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-800 transition hover:-translate-y-0.5 hover:bg-cyan-400/16"
              >
                {primaryLabel}
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-[color:var(--line-soft)] px-5 py-3 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {(["renders", "dev", "meta"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={cn(
                  "rounded-full px-3 py-2 text-xs font-semibold transition",
                  panelTab === tab
                    ? "bg-slate-900 text-white shadow"
                    : "border border-[color:var(--line-soft)] bg-white text-[color:var(--text-secondary)] hover:border-slate-400 hover:text-[color:var(--text-strong)]",
                )}
              >
                {tab === "renders"
                  ? labels.panelRenders
                  : tab === "dev"
                    ? labels.panelDev
                    : labels.panelMeta}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {panelTab === "renders" ? (
            <section>
              <p className="text-sm text-[color:var(--text-secondary)]">
                {labels.panelRenderBody}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onRefreshRenders}
                  disabled={renderLoading}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 disabled:opacity-50"
                >
                  {labels.actionRefreshList}
                </button>
                <button
                  type="button"
                  onClick={onPrimaryAction}
                  className="rounded-xl border border-cyan-500/28 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-400/16"
                >
                  {labels.actionRenderNow}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {renderLoading ? (
                  <div className="rounded-3xl border border-[color:var(--line-soft)] bg-white/70 p-4 text-sm text-[color:var(--text-secondary)]">
                    Loading...
                  </div>
                ) : renderAssets.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-[color:var(--line-soft)] bg-white/60 p-5 text-sm text-[color:var(--text-secondary)]">
                    {labels.panelNoRender}
                  </div>
                ) : (
                  renderAssets.map((asset) => (
                    <article
                      key={`${project.appId}:${asset.relativePath}`}
                      className="rounded-3xl border border-[color:var(--line-soft)] bg-white/75 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-[color:var(--text-strong)]">
                            {asset.fileName}
                          </h3>
                          <p className="mt-1 break-all text-xs text-[color:var(--text-secondary)]">
                            {asset.relativePath}
                          </p>
                          <p className="mt-2 text-xs text-[color:var(--text-secondary)]">
                            {formatFileSize(asset.size)} /{" "}
                            {formatLastRendered(asset.updatedAt, language)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenPreview(asset)}
                            className="rounded-xl border border-cyan-500/28 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-400/16"
                          >
                            {getPrimaryActionLabel(language, "ready_to_watch")}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              window.open(
                                asset.url,
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
                          >
                            {labels.actionOpenInNewTab}
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRender(asset)}
                            disabled={
                              busyKey ===
                              `${project.appId}:delete-render:${asset.relativePath}`
                            }
                            className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:border-red-400 disabled:opacity-50"
                          >
                            {labels.actionDeleteRender}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          ) : null}

          {panelTab === "dev" ? (
            <section>
              <p className="text-sm text-[color:var(--text-secondary)]">
                {labels.panelDevBody}
              </p>
              <div className="mt-4 rounded-3xl border border-[color:var(--line-soft)] bg-white/75 p-4">
                {isDevRunning ? (
                  <>
                    <p className="text-sm font-semibold text-[color:var(--text-strong)]">
                      {labels.panelRunningOn}: :{devServer?.port}
                    </p>
                    <p className="mt-2 text-xs text-[color:var(--text-secondary)]">
                      {labels.panelPid}: {devServer?.pid}
                    </p>
                    <p className="mt-1 break-all text-xs text-[color:var(--text-secondary)]">
                      {labels.panelLog}: {devServer?.logPath || "(none)"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-[color:var(--text-secondary)]">
                    {labels.panelStopped}
                  </p>
                )}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={isDevRunning ? onStopDev : onRunDev}
                  disabled={
                    busyKey ===
                    (isDevRunning
                      ? `${project.appId}:stop-dev`
                      : `${project.appId}:dev`)
                  }
                  className="rounded-2xl border border-cyan-500/28 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-800 transition hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isDevRunning ? labels.actionStopDev : labels.actionRunDev}
                </button>
                <button
                  type="button"
                  onClick={onOpenDev}
                  disabled={!isDevRunning}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {labels.actionOpenDev}
                </button>
              </div>
            </section>
          ) : null}

          {panelTab === "meta" ? (
            <section>
              <p className="text-sm text-[color:var(--text-secondary)]">
                {labels.panelMetaBody}
              </p>
              <div className="mt-4 space-y-4 rounded-3xl border border-[color:var(--line-soft)] bg-white/75 p-4">
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700/80">
                    {labels.panelTitle}
                  </span>
                  <input
                    value={draft?.title ?? ""}
                    onChange={(event) =>
                      onDraftChange("title", event.target.value)
                    }
                    placeholder={labels.placeholderTitle}
                    className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700/80">
                    {labels.panelDescription}
                  </span>
                  <textarea
                    value={draft?.description ?? ""}
                    onChange={(event) =>
                      onDraftChange("description", event.target.value)
                    }
                    placeholder={labels.placeholderDescription}
                    className="h-28 w-full rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700/80">
                      {labels.panelTags}
                    </span>
                    <input
                      value={draft?.tags ?? ""}
                      onChange={(event) =>
                        onDraftChange("tags", event.target.value)
                      }
                      placeholder={labels.placeholderTags}
                      className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700/80">
                      {labels.panelCategory}
                    </span>
                    <input
                      value={draft?.category ?? ""}
                      onChange={(event) =>
                        onDraftChange("category", event.target.value)
                      }
                      placeholder={labels.placeholderCategory}
                      className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                    />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700/80">
                    {labels.panelThumbnail}
                  </span>
                  <input
                    value={draft?.thumbnail ?? ""}
                    onChange={(event) =>
                      onDraftChange("thumbnail", event.target.value)
                    }
                    placeholder={labels.placeholderThumbnail}
                    className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onSaveMeta}
                    disabled={busyKey === `${project.appId}:save`}
                    className="rounded-2xl border border-cyan-500/28 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-800 transition hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {labels.actionSave}
                  </button>
                  <button
                    type="button"
                    onClick={onDeleteProject}
                    disabled={busyKey === `${project.appId}:delete-project`}
                    className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {labels.actionDeleteProject}
                  </button>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
