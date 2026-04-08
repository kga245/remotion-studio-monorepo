import { type VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { getCopy, getProjectStateLabel } from "@/components/studio/copy";
import type {
  DevServerState,
  ForgeRank,
  Language,
  ProjectListItem,
  ProjectState,
  SortOption,
} from "@/components/studio/types";

export function formatLastRendered(
  value: string | null,
  language: Language,
): string {
  if (!value) {
    return getCopy(language).labelNeverRendered;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export function buildThumbnailUrl(project: {
  appId: string;
  thumbnail: string;
  thumbnailUrl?: string;
}): string {
  if (project.thumbnailUrl) {
    return project.thumbnailUrl;
  }
  return `/api/thumbnail?app=${encodeURIComponent(project.appId)}&file=${encodeURIComponent(project.thumbnail)}`;
}

export function buildRenderUrl(appId: string, file: string): string {
  return `/api/renders?app=${encodeURIComponent(appId)}&file=${encodeURIComponent(file)}`;
}

export function extractFileName(relativePath: string): string {
  const tokens = relativePath.split("/");
  return tokens[tokens.length - 1] ?? relativePath;
}

export function openUrlWithFallback(url: string): boolean {
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (popup) {
    return true;
  }
  window.location.assign(url);
  return false;
}

export function formatFileSize(bytes: number): string {
  if (bytes <= 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  const power = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** power;
  return `${value.toFixed(power === 0 ? 0 : 1)} ${units[power]}`;
}

export function toDevServerState(
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

export function resolveForgeRank(score: number): ForgeRank {
  if (score >= 85) {
    return "stable";
  }
  if (score >= 60) {
    return "smooth";
  }
  if (score >= 35) {
    return "warming";
  }
  return "ready";
}

export function getProjectState(
  project: ProjectListItem,
  devServer?: DevServerState,
): ProjectState {
  if (devServer) {
    return "active_dev";
  }
  const normalizedCategory = project.category.toLowerCase();
  const renderReady = Boolean(project.renderCount > 0 || project.lastRendered);
  if (
    normalizedCategory === "template" ||
    normalizedCategory === "example" ||
    normalizedCategory === "tooling"
  ) {
    return "template";
  }
  if (renderReady) {
    return "ready_to_watch";
  }
  return "needs_render";
}

function toRenderedTime(project: ProjectListItem): number {
  const value = project.latestRenderAt ?? project.lastRendered;
  if (!value) {
    return 0;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

export function sortProjects(
  projects: ProjectListItem[],
  sort: SortOption,
  language: Language,
): ProjectListItem[] {
  return [...projects].sort((left, right) => {
    if (sort === "title") {
      return left.title.localeCompare(
        right.title,
        language === "ja" ? "ja" : "en",
      );
    }
    if (sort === "category") {
      const categoryCompare = left.category.localeCompare(
        right.category,
        language === "ja" ? "ja" : "en",
      );
      if (categoryCompare !== 0) {
        return categoryCompare;
      }
      return left.title.localeCompare(
        right.title,
        language === "ja" ? "ja" : "en",
      );
    }

    const recentCompare = toRenderedTime(right) - toRenderedTime(left);
    if (recentCompare !== 0) {
      return recentCompare;
    }
    return left.title.localeCompare(
      right.title,
      language === "ja" ? "ja" : "en",
    );
  });
}

export function getTone(
  category: string,
): "default" | "cyan" | "emerald" | "violet" {
  const normalized = category.toLowerCase();
  if (normalized.includes("3d") || normalized.includes("animation")) {
    return "cyan";
  }
  if (normalized.includes("template") || normalized.includes("tool")) {
    return "violet";
  }
  if (normalized.includes("example")) {
    return "emerald";
  }
  return "default";
}

export function toBadgeVariant(
  tone: "default" | "cyan" | "emerald" | "violet",
) {
  if (tone === "cyan") return "cyan";
  if (tone === "emerald") return "emerald";
  if (tone === "violet") return "violet";
  return "default";
}

export const cardToneVariants = cva(
  "transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.16)]",
  {
    variants: {
      tone: {
        default: "hover:border-[rgba(14,165,233,0.34)]",
        cyan: "hover:border-[#38bdf8]",
        emerald: "hover:border-[#84cc16]",
        violet: "hover:border-[#a78bfa]",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export type CardToneVariant = VariantProps<typeof cardToneVariants>;

export async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function getPrimaryActionLabel(
  language: Language,
  state: ProjectState,
): string {
  const copy = getCopy(language);
  if (state === "ready_to_watch") return copy.primaryWatch;
  if (state === "active_dev") return copy.primaryOpenDev;
  if (state === "template") return copy.primaryRunDev;
  return copy.primaryRender;
}

export function getStateBadgeTone(state: ProjectState) {
  if (state === "active_dev") return "cyan";
  if (state === "ready_to_watch") return "emerald";
  if (state === "template") return "violet";
  return "default";
}

export function getStateBadgeLabel(language: Language, state: ProjectState) {
  return getProjectStateLabel(language, state);
}

export { getProjectStateLabel };
