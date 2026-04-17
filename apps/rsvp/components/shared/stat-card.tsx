"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label?: string;
    isPositive: boolean;
  };
  isLoading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  isLoading,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <p className="text-[12px] font-medium text-gray-400 uppercase tracking-wide">
            {title}
          </p>
          {isLoading ? (
            <div className="h-7 w-16 animate-pulse rounded bg-gray-100" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 font-heading tabular-nums">
              {value}
            </p>
          )}
          <div className="flex items-center gap-2 min-h-[16px]">
            {description && (
              <p className="text-[11px] text-gray-400 truncate">
                {description}
              </p>
            )}
            {trend && !isLoading && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-[11px] font-semibold shrink-0 rounded-full px-1.5 py-0.5",
                  trend.isPositive
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-red-500 bg-red-50",
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.label
                  ? `${Math.abs(trend.value)} ${trend.label}`
                  : `${Math.abs(trend.value)}%`}
              </span>
            )}
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
          <Icon className="h-[18px] w-[18px] text-primary" />
        </div>
      </div>
    </div>
  );
}
