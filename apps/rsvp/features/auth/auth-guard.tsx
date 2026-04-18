"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { BrandLoader } from "@/components/ui/brand-loader";

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
        <BrandLoader size="md" label="Loading" />
      </div>
    );
  }

  return <>{children}</>;
}
