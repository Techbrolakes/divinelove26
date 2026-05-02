"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const token = typeof window !== "undefined" ? getAuthToken() : null;
  const trpc = useTRPC();

  const { data, error, isLoading } = useQuery({
    ...trpc.auth.getProfile.queryOptions(),
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    if (!isLoading) {
      if (error || !data) {
        router.replace("/admin/login");
      } else {
        setIsChecking(false);
      }
    }
  }, [token, isLoading, error, data, router]);

  if (isChecking || isLoading) {
    return <DashboardSkeleton />;
  }

  return <>{children}</>;
}

function DashboardSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen bg-white"
    >
      <span className="sr-only">Loading…</span>

      {/* Sidebar placeholder (desktop only) */}
      <div className="hidden md:flex fixed inset-y-0 left-0 z-30 w-[260px] flex-col border-r border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="h-11 w-11 rounded-full bg-gray-200/80 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-20 rounded bg-gray-200/80 animate-pulse" />
            <div className="h-3 w-14 rounded bg-gray-200/80 animate-pulse" />
          </div>
        </div>
        <div className="flex-1 space-y-2 px-3 py-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-2.5 py-2.5"
            >
              <div className="h-8 w-8 rounded-lg bg-gray-200/80 animate-pulse" />
              <div className="h-3 flex-1 rounded bg-gray-200/80 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-200/80 animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-24 rounded bg-gray-200/80 animate-pulse" />
              <div className="h-2.5 w-16 rounded bg-gray-200/80 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="md:ml-[260px]">
        {/* Header */}
        <div className="h-14 border-b border-gray-100 px-3 sm:px-8 flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-gray-200/80 animate-pulse md:hidden" />
          <div className="h-3 w-32 rounded bg-gray-200/80 animate-pulse" />
          <div className="ml-auto h-8 w-8 rounded-full bg-gray-200/80 animate-pulse" />
        </div>

        <main className="px-3 py-6 sm:px-8 sm:py-8 space-y-6">
          {/* Hero placeholder */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-6 md:p-7 space-y-3">
            <div className="h-2.5 w-24 rounded bg-gray-200/80 animate-pulse" />
            <div className="h-7 w-56 rounded bg-gray-200/80 animate-pulse" />
            <div className="h-3 w-72 max-w-full rounded bg-gray-200/80 animate-pulse" />
          </div>

          {/* Stats grid placeholder */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-white p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-2.5 w-16 rounded bg-gray-200/80 animate-pulse" />
                    <div className="h-7 w-12 rounded bg-gray-200/80 animate-pulse" />
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-gray-200/80 animate-pulse" />
                </div>
                <div className="h-1 w-full rounded-full bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Body placeholder */}
          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-white p-4 flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-lg bg-gray-200/80 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-gray-200/80 animate-pulse" />
                  <div className="h-2.5 w-1/2 rounded bg-gray-200/80 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
