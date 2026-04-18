"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  isLoading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  isLoading,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-royal/30 hover:-translate-y-0.5",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      {/* Top accent — royal bar that slides in on hover */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-royal via-royal-light to-royal opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5 flex-1 min-w-0">
          <p className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">
            {title}
          </p>
          {isLoading ? (
            <div className="h-10 w-20 animate-pulse rounded bg-gray-100" />
          ) : (
            <p className="font-serif text-[40px] leading-none font-light text-royal-dark tabular-nums">
              {value}
            </p>
          )}
          {description && (
            <p className="font-sans text-[12px] text-gray-500 truncate">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-royal-50 to-royal-100/60 shrink-0 ring-1 ring-royal-100 group-hover:from-royal-100 group-hover:to-royal-50 transition-colors">
          <Icon className="h-5 w-5 text-royal" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
