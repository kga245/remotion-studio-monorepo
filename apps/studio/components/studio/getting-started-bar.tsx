"use client";

export function GettingStartedBar({
  title,
  steps,
  closeLabel,
  onClose,
}: {
  title: string;
  steps: string[];
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <section className="rounded-[var(--radius-card)] border border-cyan-200/70 bg-cyan-50/80 px-5 py-4 shadow-[0_18px_40px_rgba(8,145,178,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-cyan-950">{title}</p>
          <div className="flex flex-wrap gap-2">
            {steps.map((step) => (
              <span
                key={step}
                className="rounded-full border border-cyan-200 bg-white/90 px-3 py-2 text-xs font-medium text-cyan-950"
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-cyan-900 transition hover:border-cyan-300"
        >
          {closeLabel}
        </button>
      </div>
    </section>
  );
}
