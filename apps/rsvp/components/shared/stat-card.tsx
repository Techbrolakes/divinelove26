"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

type StatTone = "neutral" | "amber" | "royal" | "green";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  isLoading?: boolean;
  className?: string;
  tone?: StatTone;
  /** Optional 0-100 value to render a mini progress bar. */
  progress?: number;
}

const TONES: Record<
  StatTone,
  { iconWrap: string; bar: string; track: string; glow: string }
> = {
  neutral: {
    iconWrap:
      "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600 ring-1 ring-inset ring-gray-200/60",
    bar: "bg-gray-300",
    track: "bg-gray-100",
    glow: "from-gray-50/0 via-gray-50/0 to-gray-50/40",
  },
  amber: {
    iconWrap:
      "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/70",
    bar: "bg-amber-500",
    track: "bg-amber-100/60",
    glow: "from-amber-50/0 via-amber-50/0 to-amber-50/60",
  },
  royal: {
    iconWrap:
      "bg-gradient-to-br from-royal-100 to-royal-50 text-royal ring-1 ring-inset ring-royal-100",
    bar: "bg-royal",
    track: "bg-royal-50",
    glow: "from-royal-50/0 via-royal-50/0 to-royal-50/60",
  },
  green: {
    iconWrap:
      "bg-gradient-to-br from-green-100 to-green-50 text-green-700 ring-1 ring-inset ring-green-200/70",
    bar: "bg-green-500",
    track: "bg-green-100/60",
    glow: "from-green-50/0 via-green-50/0 to-green-50/60",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  isLoading,
  className,
  tone = "royal",
  progress,
}: StatCardProps) {
  const t = TONES[tone];
  const showBar =
    typeof progress === "number" && Number.isFinite(progress) && !isLoading;
  const pct = showBar
    ? Math.min(100, Math.max(0, Math.round(progress as number)))
    : 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(11,61,145,0.04)] transition-all hover:border-gray-300 hover:shadow-[0_4px_14px_rgba(11,61,145,0.08)]",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl bg-gradient-to-br",
          t.glow,
        )}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[10.5px] font-semibold tracking-[0.18em] uppercase text-gray-500">
            {title}
          </p>
          {isLoading ? (
            <div className="mt-2 h-7 w-16 animate-pulse rounded bg-gray-100" />
          ) : (
            <p className="mt-2 font-sans text-[28px] leading-none font-semibold tracking-tight text-gray-900 tabular-nums">
              {value}
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            t.iconWrap,
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
      </div>

      {showBar ? (
        <div className="relative mt-4">
          <div
            className={cn("h-1 w-full overflow-hidden rounded-full", t.track)}
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-500 ease-out",
                t.bar,
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          {description && (
            <p className="mt-1.5 font-sans text-[11px] text-gray-500 truncate">
              {description}
            </p>
          )}
        </div>
      ) : description ? (
        <p className="relative mt-3 font-sans text-[11.5px] text-gray-500 truncate">
          {description}
        </p>
      ) : null}
    </div>
  );
}
