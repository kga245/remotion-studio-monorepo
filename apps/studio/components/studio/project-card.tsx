"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  cardToneVariants,
  formatLastRendered,
  getPrimaryActionLabel,
  getProjectStateLabel,
  getStateBadgeTone,
  getTone,
  toBadgeVariant,
} from "@/components/studio/helpers";
import type {
  Language,
  ProjectListItem,
  ProjectState,
} from "@/components/studio/types";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  projectState,
  language,
  labels,
  isSelected,
  onPrimaryAction,
  onManage,
}: {
  project: ProjectListItem;
  projectState: ProjectState;
  language: Language;
  labels: {
    labelLastRendered: string;
    labelRenderFiles: string;
    labelAppPath: string;
    labelNoTags: string;
    actionManage: string;
  };
  isSelected: boolean;
  onPrimaryAction: () => void;
  onManage: () => void;
}) {
  const tone = getTone(project.category);
  const latestRenderUrl = project.latestRenderFile
    ? `/api/renders?app=${encodeURIComponent(project.appId)}&file=${encodeURIComponent(project.latestRenderFile)}`
    : null;
  const primaryLabel = getPrimaryActionLabel(language, projectState);
  const stateLabel = getProjectStateLabel(language, projectState);
  const visibleTags = project.tags.slice(0, 4);
  const hiddenCount = Math.max(0, project.tags.length - visibleTags.length);

  return (
    <Card
      className={cn(
        cardToneVariants({ tone }),
        "forge-card overflow-hidden border-white/60 bg-[rgba(255,255,255,0.78)] shadow-[0_24px_44px_rgba(15,23,42,0.1)]",
        isSelected ? "ring-2 ring-cyan-300/60" : "",
      )}
    >
      <div className="relative aspect-video overflow-hidden border-b border-[color:var(--line-soft)] bg-slate-950">
        {latestRenderUrl ? (
          <video
            key={`${project.appId}:preview`}
            className="absolute inset-0 h-full w-full object-cover opacity-90"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            src={latestRenderUrl}
          />
        ) : (
          <img
            src={project.thumbnailUrl}
            alt={`${project.title} thumbnail`}
            className="h-full w-full object-cover opacity-92"
            loading="lazy"
            onError={(event) => {
              const fallback = `/api/thumbnail?app=${encodeURIComponent(project.appId)}&file=${encodeURIComponent("public/thumbnail.svg")}`;
              const image = event.currentTarget;
              if (!image.src.includes("file=public%2Fthumbnail.svg")) {
                image.src = fallback;
              }
            }}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.46))]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge variant={getStateBadgeTone(projectState)}>{stateLabel}</Badge>
          <Badge variant={toBadgeVariant(tone)}>{project.category}</Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-[color:var(--text-strong)]">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[color:var(--text-secondary)]">
              {project.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {visibleTags.length > 0 ? (
            <>
              {visibleTags.map((tag) => (
                <span
                  key={`${project.appId}-${tag}`}
                  className="rounded-full border border-[color:var(--line-soft)] bg-white px-2.5 py-1 text-xs text-[color:var(--text-secondary)]"
                >
                  #{tag}
                </span>
              ))}
              {hiddenCount > 0 ? (
                <span className="rounded-full border border-dashed border-[color:var(--line-soft)] px-2.5 py-1 text-xs text-[color:var(--text-secondary)]">
                  +{hiddenCount}
                </span>
              ) : null}
            </>
          ) : (
            <span className="text-xs text-[color:var(--text-secondary)]">
              {labels.labelNoTags}
            </span>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[color:var(--line-soft)] bg-white/70 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700/80">
              {labels.labelLastRendered}
            </p>
            <p className="mt-1 text-sm font-semibold text-[color:var(--text-strong)]">
              {formatLastRendered(project.lastRendered, language)}
            </p>
          </div>
          <div className="rounded-2xl border border-[color:var(--line-soft)] bg-white/70 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700/80">
              {labels.labelRenderFiles}
            </p>
            <p className="mt-1 text-sm font-semibold text-[color:var(--text-strong)]">
              {project.renderCount}
            </p>
          </div>
          <div className="rounded-2xl border border-[color:var(--line-soft)] bg-white/70 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700/80">
              {labels.labelAppPath}
            </p>
            <p className="mt-1 line-clamp-2 text-sm font-semibold text-[color:var(--text-strong)]">
              {project.appId}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-[1.25fr_0.85fr]">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="rounded-2xl border border-cyan-500/28 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-800 transition hover:-translate-y-0.5 hover:bg-cyan-400/16"
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            onClick={onManage}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400"
          >
            {labels.actionManage}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
