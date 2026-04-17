"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";

export function useAdminMe() {
  const trpc = useTRPC();
  return useQuery(trpc.auth.getProfile.queryOptions());
}
