"use client";

import { DashboardHeader } from "@/components/studio/dashboard-header";
import { GettingStartedBar } from "@/components/studio/getting-started-bar";
import { PreviewModal } from "@/components/studio/preview-modal";
import { ProjectCard } from "@/components/studio/project-card";
import { ProjectPanel } from "@/components/studio/project-panel";
import { getProjectState } from "@/components/studio/helpers";
import { useStudioDashboard } from "@/components/studio/use-studio-dashboard";
import type { ProjectListItem } from "@/components/studio/types";

export function DashboardShell({
  initialProjects,
}: {
  initialProjects: ProjectListItem[];
}) {
  const dashboard = useStudioDashboard(initialProjects);
  const selectedProject = dashboard.selectedProject;

  return (
    <main className="forge-shell min-h-screen px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHeader
          language={dashboard.language}
          title={dashboard.t.topTitle}
          categories={dashboard.categories}
          query={dashboard.query}
          category={dashboard.category}
          status={dashboard.status}
          sort={dashboard.sort}
          onLanguageChange={dashboard.setLanguage}
          onQueryChange={dashboard.setQuery}
          onCategoryChange={dashboard.setCategory}
          onStatusChange={dashboard.setStatus}
          onSortChange={dashboard.setSort}
          onReload={() => window.location.reload()}
          labels={{
            searchLabel: dashboard.t.searchLabel,
            searchPlaceholder: dashboard.t.searchPlaceholder,
            categoryLabel: dashboard.t.categoryLabel,
            statusLabel: dashboard.t.statusLabel,
            sortLabel: dashboard.t.sortLabel,
            filterAll: dashboard.t.filterAll,
            quickReload: dashboard.t.quickReload,
            showingPrefix: dashboard.t.showingPrefix,
            showingSuffix: dashboard.t.showingSuffix,
            syncing: dashboard.t.syncing,
          }}
          showingCount={dashboard.filteredProjects.length}
          totalCount={dashboard.projects.length}
          statusLoading={dashboard.statusLoading}
          message={dashboard.message}
        />

        {dashboard.showGuide ? (
          <GettingStartedBar
            title={dashboard.t.guideTitle}
            steps={[
              dashboard.t.guideStepWatch,
              dashboard.t.guideStepManage,
              dashboard.t.guideStepStart,
            ]}
            closeLabel={dashboard.t.guideDismiss}
            onClose={dashboard.dismissGuide}
          />
        ) : null}

        {dashboard.sections.length === 0 ? (
          <section className="rounded-[var(--radius-card)] border border-dashed border-[color:var(--line-soft)] bg-white/70 p-8 text-center shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
            <p className="text-lg font-semibold text-[color:var(--text-primary)]">
              {dashboard.t.noMatchTitle}
            </p>
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
              {dashboard.t.noMatchBody}
            </p>
          </section>
        ) : (
          dashboard.sections.map((section) => (
            <section key={section.key} className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-700/80">
                    {section.key}
                  </p>
                  <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[color:var(--text-strong)]">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                    {section.description}
                  </p>
                </div>
                <div className="rounded-full border border-[color:var(--line-soft)] bg-white/70 px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)]">
                  {section.projects.length}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {section.projects.map((project) => {
                  const projectState = getProjectState(
                    project,
                    dashboard.devServers[project.appId],
                  );

                  return (
                    <ProjectCard
                      key={project.appId}
                      project={project}
                      projectState={projectState}
                      language={dashboard.language}
                      labels={{
                        labelLastRendered: dashboard.t.labelLastRendered,
                        labelRenderFiles: dashboard.t.labelRenderFiles,
                        labelAppPath: dashboard.t.labelAppPath,
                        labelNoTags: dashboard.t.labelNoTags,
                        actionManage: dashboard.t.actionManage,
                      }}
                      isSelected={
                        dashboard.selectedProject?.appId === project.appId
                      }
                      onPrimaryAction={() =>
                        void dashboard.handlePrimaryAction(project)
                      }
                      onManage={() =>
                        dashboard.openControlPanel(
                          project,
                          projectState === "ready_to_watch" ? "renders" : "dev",
                        )
                      }
                    />
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      <ProjectPanel
        project={dashboard.selectedProject}
        projectState={dashboard.selectedProjectState}
        language={dashboard.language}
        labels={{
          actionClose: dashboard.t.actionClose,
          actionOpenInNewTab: dashboard.t.actionOpenInNewTab,
          actionRefreshList: dashboard.t.actionRefreshList,
          actionRenderNow: dashboard.t.actionRenderNow,
          actionDeleteRender: dashboard.t.actionDeleteRender,
          actionRunDev: dashboard.t.actionRunDev,
          actionStopDev: dashboard.t.actionStopDev,
          actionOpenDev: dashboard.t.actionOpenDev,
          actionSave: dashboard.t.actionSave,
          actionDeleteProject: dashboard.t.actionDeleteProject,
          manageTitle: dashboard.t.manageTitle,
          manageSubtitle: dashboard.t.manageSubtitle,
          panelRenders: dashboard.t.panelRenders,
          panelDev: dashboard.t.panelDev,
          panelMeta: dashboard.t.panelMeta,
          panelLatestRender: dashboard.t.panelLatestRender,
          panelNoRender: dashboard.t.panelNoRender,
          panelRenderBody: dashboard.t.panelRenderBody,
          panelDevBody: dashboard.t.panelDevBody,
          panelMetaBody: dashboard.t.panelMetaBody,
          panelPreviewStatic: dashboard.t.panelPreviewStatic,
          panelRunningOn: dashboard.t.panelRunningOn,
          panelStopped: dashboard.t.panelStopped,
          panelLog: dashboard.t.panelLog,
          panelPid: dashboard.t.panelPid,
          panelTitle: dashboard.t.panelTitle,
          panelDescription: dashboard.t.panelDescription,
          panelTags: dashboard.t.panelTags,
          panelCategory: dashboard.t.panelCategory,
          panelThumbnail: dashboard.t.panelThumbnail,
          placeholderTitle: dashboard.t.placeholderTitle,
          placeholderDescription: dashboard.t.placeholderDescription,
          placeholderTags: dashboard.t.placeholderTags,
          placeholderCategory: dashboard.t.placeholderCategory,
          placeholderThumbnail: dashboard.t.placeholderThumbnail,
        }}
        panelTab={dashboard.panelTab}
        onTabChange={(tab) => {
          dashboard.setPanelTab(tab);
          if (tab === "meta" && selectedProject) {
            dashboard.setDrafts((prev) => ({
              ...prev,
              [selectedProject.appId]: prev[selectedProject.appId] ?? {
                title: selectedProject.title,
                description: selectedProject.description,
                tags: selectedProject.tags.join(", "),
                category: selectedProject.category,
                thumbnail: selectedProject.thumbnail,
              },
            }));
          }
          if (tab === "renders" && selectedProject) {
            void dashboard.syncRenderAssets(selectedProject.appId, {
              silent: true,
            });
          }
        }}
        onClose={dashboard.closeControlPanel}
        onPrimaryAction={() =>
          selectedProject
            ? void dashboard.handlePrimaryAction(selectedProject)
            : undefined
        }
        onRefreshRenders={() =>
          selectedProject
            ? void dashboard.syncRenderAssets(selectedProject.appId)
            : undefined
        }
        onOpenPreview={(asset) =>
          dashboard.setPreview({
            appId: selectedProject?.appId ?? "",
            title: selectedProject?.title ?? "",
            relativePath: asset.relativePath,
            url: asset.url,
            updatedAt: asset.updatedAt,
            size: asset.size,
          })
        }
        onDeleteRender={(asset) =>
          selectedProject
            ? void dashboard.deleteRenderAsset(selectedProject, asset)
            : undefined
        }
        onRunDev={() =>
          selectedProject ? void dashboard.runDev(selectedProject) : undefined
        }
        onStopDev={() =>
          selectedProject ? void dashboard.stopDev(selectedProject) : undefined
        }
        onOpenDev={() =>
          selectedProject ? dashboard.openDev(selectedProject) : undefined
        }
        onSaveMeta={() =>
          selectedProject ? void dashboard.saveMeta(selectedProject) : undefined
        }
        onDeleteProject={() =>
          selectedProject
            ? void dashboard.deleteProject(selectedProject)
            : undefined
        }
        busyKey={dashboard.busyKey}
        renderAssets={
          selectedProject
            ? (dashboard.renderAssetsByApp[selectedProject.appId] ?? [])
            : []
        }
        renderLoading={
          selectedProject
            ? Boolean(dashboard.renderLoadingByApp[selectedProject.appId])
            : false
        }
        devServer={
          selectedProject
            ? dashboard.devServers[selectedProject.appId]
            : undefined
        }
        draft={
          selectedProject ? dashboard.drafts[selectedProject.appId] : undefined
        }
        onDraftChange={(key, value) => {
          if (!selectedProject) {
            return;
          }
          dashboard.setDrafts((prev) => ({
            ...prev,
            [selectedProject.appId]: {
              ...prev[selectedProject.appId],
              [key]: value,
            },
          }));
        }}
      />

      <PreviewModal
        preview={dashboard.preview}
        language={dashboard.language}
        labels={{
          previewTitle: dashboard.t.previewTitle,
          previewApp: dashboard.t.previewApp,
          previewUpdated: dashboard.t.previewUpdated,
          previewSize: dashboard.t.previewSize,
          labelUnknown: dashboard.t.labelUnknown,
          actionOpenInNewTab: dashboard.t.actionOpenInNewTab,
          actionClose: dashboard.t.actionClose,
        }}
        onClose={() => dashboard.setPreview(null)}
      />
    </main>
  );
}
