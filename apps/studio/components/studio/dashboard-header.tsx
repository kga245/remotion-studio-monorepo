"use client";

import { getSortLabel, getStatusLabel } from "@/components/studio/copy";
import type {
  Language,
  SortOption,
  StatusFilter,
} from "@/components/studio/types";

export function DashboardHeader({
  language,
  title,
  categories,
  query,
  category,
  status,
  sort,
  onLanguageChange,
  onQueryChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onReload,
  labels,
  showingCount,
  totalCount,
  statusLoading,
  message,
}: {
  language: Language;
  title: string;
  categories: string[];
  query: string;
  category: string;
  status: StatusFilter;
  sort: SortOption;
  onLanguageChange: (next: Language) => void;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onSortChange: (value: SortOption) => void;
  onReload: () => void;
  labels: {
    searchLabel: string;
    searchPlaceholder: string;
    categoryLabel: string;
    statusLabel: string;
    sortLabel: string;
    filterAll: string;
    quickReload: string;
    showingPrefix: string;
    showingSuffix: string;
    syncing: string;
  };
  showingCount: number;
  totalCount: number;
  statusLoading: boolean;
  message: string | null;
}) {
  return (
    <header className="rounded-[calc(var(--radius-card)+4px)] border border-[color:var(--line-soft)] bg-white/78 px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-6">
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-[color:var(--text-strong)] sm:text-3xl">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--text-secondary)]">
            <div className="inline-flex items-center rounded-full border border-[color:var(--line-soft)] bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => onLanguageChange("ja")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  language === "ja"
                    ? "bg-slate-900 text-white"
                    : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-strong)]"
                }`}
              >
                日本語
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange("en")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  language === "en"
                    ? "bg-slate-900 text-white"
                    : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-strong)]"
                }`}
              >
                English
              </button>
            </div>
            <span>
              {labels.showingPrefix} {showingCount}/{totalCount}{" "}
              {labels.showingSuffix}
              {statusLoading ? ` / ${labels.syncing}` : ""}
            </span>
            <button
              type="button"
              onClick={onReload}
              className="rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--text-primary)] transition hover:border-slate-400"
            >
              {labels.quickReload}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.5fr_repeat(3,minmax(0,0.72fr))]">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
              {labels.searchLabel}
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none transition placeholder:text-slate-400 focus:border-cyan-300/55 focus:ring-2 focus:ring-cyan-300/30"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
              {labels.categoryLabel}
            </span>
            <select
              aria-label={labels.categoryLabel}
              value={category}
              onChange={(event) => onCategoryChange(event.target.value)}
              className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none transition focus:border-cyan-300/55 focus:ring-2 focus:ring-cyan-300/30"
            >
              <option value="all">{labels.filterAll}</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
              {labels.statusLabel}
            </span>
            <select
              aria-label={labels.statusLabel}
              value={status}
              onChange={(event) =>
                onStatusChange(event.target.value as StatusFilter)
              }
              className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none transition focus:border-cyan-300/55 focus:ring-2 focus:ring-cyan-300/30"
            >
              {(
                [
                  "all",
                  "active_dev",
                  "ready_to_watch",
                  "needs_render",
                  "template",
                ] as const
              ).map((item) => (
                <option key={item} value={item}>
                  {getStatusLabel(language, item)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
              {labels.sortLabel}
            </span>
            <select
              aria-label={labels.sortLabel}
              value={sort}
              onChange={(event) =>
                onSortChange(event.target.value as SortOption)
              }
              className="w-full rounded-2xl border border-[color:var(--line-soft)] bg-white px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none transition focus:border-cyan-300/55 focus:ring-2 focus:ring-cyan-300/30"
            >
              {(["recent", "title", "category"] as const).map((item) => (
                <option key={item} value={item}>
                  {getSortLabel(language, item)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {message ? (
          <div className="mt-3 rounded-2xl border border-amber-300/35 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {message}
          </div>
        ) : null}
      </div>
    </header>
  );
}
