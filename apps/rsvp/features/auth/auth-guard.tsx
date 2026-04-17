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
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-white"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
          <p className="text-[13px] font-medium text-gray-500">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
