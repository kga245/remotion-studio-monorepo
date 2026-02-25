import { existsSync, statSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";

export type AppMeta = {
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  lastRendered: string | null;
  category: string;
};

export type ProjectCard = AppMeta & {
  appId: string;
};

const SKIP_DIRS = new Set([
  ".git",
  ".next",
  ".turbo",
  "node_modules",
  "dist",
  "build",
  "out",
  "coverage",
]);

function toDisplayTitle(appId: string): string {
  return appId
    .split(/[/-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeMeta(appId: string, input: unknown): AppMeta {
  const fallbackTitle = toDisplayTitle(appId);
  const fallback: AppMeta = {
    title: fallbackTitle,
    description: `${fallbackTitle} project`,
    tags: ["remotion"],
    thumbnail: "public/thumbnail.svg",
    lastRendered: null,
    category: "general",
  };

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return fallback;
  }

  const raw = input as Record<string, unknown>;
  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((tag): tag is string => typeof tag === "string")
    : fallback.tags;

  return {
    title:
      typeof raw.title === "string" && raw.title.trim().length > 0
        ? raw.title.trim()
        : fallback.title,
    description:
      typeof raw.description === "string" && raw.description.trim().length > 0
        ? raw.description.trim()
        : fallback.description,
    tags: tags.length > 0 ? tags : fallback.tags,
    thumbnail:
      typeof raw.thumbnail === "string" && raw.thumbnail.trim().length > 0
        ? raw.thumbnail.trim()
        : fallback.thumbnail,
    lastRendered:
      typeof raw.lastRendered === "string" && raw.lastRendered.trim().length > 0
        ? raw.lastRendered.trim()
        : null,
    category:
      typeof raw.category === "string" && raw.category.trim().length > 0
        ? raw.category.trim()
        : fallback.category,
  };
}

function toRenderedTime(value: string | null): number {
  if (!value) {
    return -1;
  }
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : -1;
}

export function resolveAppsRoot(): string {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "apps"),
    path.resolve(cwd, "..", "apps"),
    path.resolve(cwd, "..", "..", "apps"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isDirectory()) {
      return candidate;
    }
  }

  throw new Error("Could not resolve workspace apps directory.");
}

async function collectMetaFiles(
  dir: string,
  depth = 0,
  maxDepth = 4,
): Promise<string[]> {
  if (depth > maxDepth) {
    return [];
  }

  const entries = await fs
    .readdir(dir, { withFileTypes: true })
    .catch(() => []);
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) {
          return [];
        }
        return collectMetaFiles(fullPath, depth + 1, maxDepth);
      }
      return entry.isFile() && entry.name === "app.meta.json" ? [fullPath] : [];
    }),
  );

  return nested.flat();
}

export async function collectProjects(): Promise<ProjectCard[]> {
  const appsRoot = resolveAppsRoot();
  const metaFiles = await collectMetaFiles(appsRoot);

  const collected = await Promise.all(
    metaFiles.map(async (metaPath) => {
      try {
        const appId = path
          .relative(appsRoot, path.dirname(metaPath))
          .replaceAll(path.sep, "/");
        const text = await fs.readFile(metaPath, "utf8");
        return {
          appId,
          ...normalizeMeta(appId, JSON.parse(text)),
        } satisfies ProjectCard;
      } catch {
        return null;
      }
    }),
  );

  return collected
    .filter((item): item is ProjectCard => item !== null)
    .sort(
      (a, b) => toRenderedTime(b.lastRendered) - toRenderedTime(a.lastRendered),
    );
}

export function formatLastRendered(value: string | null): string {
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

export function buildThumbnailUrl(project: ProjectCard): string {
  return `/api/thumbnail?app=${encodeURIComponent(project.appId)}&file=${encodeURIComponent(project.thumbnail)}`;
}
