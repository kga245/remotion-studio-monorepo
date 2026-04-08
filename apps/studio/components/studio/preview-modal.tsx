"use client";

import {
  extractFileName,
  formatFileSize,
  formatLastRendered,
} from "@/components/studio/helpers";
import type { Language, PreviewState } from "@/components/studio/types";

export function PreviewModal({
  preview,
  language,
  labels,
  onClose,
}: {
  preview: PreviewState | null;
  language: Language;
  labels: {
    previewTitle: string;
    previewApp: string;
    previewUpdated: string;
    previewSize: string;
    labelUnknown: string;
    actionOpenInNewTab: string;
    actionClose: string;
  };
  onClose: () => void;
}) {
  if (!preview) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/78 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.94))] p-4 text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">
              {labels.previewTitle}
            </p>
            <p className="mt-1 text-xl font-semibold">{preview.title}</p>
            <p className="text-sm text-slate-300">
              {extractFileName(preview.relativePath)}
            </p>
            <p className="text-xs text-slate-400">{preview.relativePath}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                window.open(preview.url, "_blank", "noopener,noreferrer")
              }
              className="rounded-2xl border border-cyan-300/35 bg-cyan-400/12 px-4 py-2 text-sm font-semibold text-cyan-50"
            >
              {labels.actionOpenInNewTab}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white"
            >
              {labels.actionClose}
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-white/8 bg-black">
          <video
            key={preview.url}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="aspect-video w-full"
            src={preview.url}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
          <span>
            {labels.previewApp}: {preview.appId}
          </span>
          <span>
            {labels.previewUpdated}:{" "}
            {preview.updatedAt
              ? formatLastRendered(preview.updatedAt, language)
              : labels.labelUnknown}
          </span>
          <span>
            {labels.previewSize}:{" "}
            {preview.size !== null
              ? formatFileSize(preview.size)
              : labels.labelUnknown}
          </span>
        </div>
      </div>
    </div>
  );
}
