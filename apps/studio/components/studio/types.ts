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
  renderCount: number;
  latestRenderFile: string | null;
  latestRenderAt: string | null;
};

export type FilterState = {
  query: string;
  category: string;
  status: StatusFilter;
  sort: SortOption;
  setQuery: (value: string) => void;
  setCategory: (value: string) => void;
  setStatus: (value: StatusFilter) => void;
  setSort: (value: SortOption) => void;
};

export type MetaDraft = {
  title: string;
  description: string;
  tags: string;
  category: string;
  thumbnail: string;
};

export type DevServerState = {
  appId: string;
  pid: number;
  port: number;
  url: string;
  logPath: string;
  startedAt: string;
};

export type ForgeStatusPayload = {
  devServers?: DevServerState[];
};

export type ForgeDevPayload = {
  message?: string;
  url?: string;
  logPath?: string;
  pid?: number;
  port?: number;
  startedAt?: string;
  alreadyRunning?: boolean;
};

export type RenderAsset = {
  relativePath: string;
  fileName: string;
  size: number;
  updatedAt: string;
  url: string;
};

export type RenderListPayload = {
  files?: RenderAsset[];
  message?: string;
};

export type PreviewState = {
  appId: string;
  title: string;
  relativePath: string;
  url: string;
  updatedAt: string | null;
  size: number | null;
};

export type Language = "ja" | "en";
export type ForgeRank = "ready" | "warming" | "smooth" | "stable";
export type StatusFilter =
  | "all"
  | "active_dev"
  | "ready_to_watch"
  | "needs_render"
  | "template";
export type SortOption = "recent" | "title" | "category";
export type ProjectState =
  | "active_dev"
  | "ready_to_watch"
  | "needs_render"
  | "template";
export type PanelTab = "renders" | "dev" | "meta";

export type ProjectSection = {
  key: string;
  title: string;
  description: string;
  projects: ProjectListItem[];
};
