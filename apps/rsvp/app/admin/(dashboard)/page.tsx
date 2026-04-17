"use client";

import { useQuery } from "@tanstack/react-query";
import { useAdminMe } from "@/features/auth/use-auth";
import { useTRPC } from "@/lib/trpc";
import { StatCard } from "@/components/shared/stat-card";
import { Users, UserCheck, UserX, Clock } from "lucide-react";

export default function DashboardPage() {
  const { data: admin } = useAdminMe();
  const firstName = admin?.firstName || "Admin";

  const trpc = useTRPC();
  const { data: stats } = useQuery(trpc.admin.getStats.queryOptions());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-semibold text-gray-900">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-[14px] text-gray-500">
          Overview of RSVPs for Divine Love 26.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Guests"
          value={String(stats?.total ?? 0)}
          icon={Users}
          description="On the guest list"
        />
        <StatCard
          title="Attending"
          value={String(stats?.attending ?? 0)}
          icon={UserCheck}
          description="Confirmed RSVPs"
        />
        <StatCard
          title="Declined"
          value={String(stats?.declined ?? 0)}
          icon={UserX}
          description="Can't make it"
        />
        <StatCard
          title="Pending"
          value={String(stats?.pending ?? 0)}
          icon={Clock}
          description="Haven't responded"
        />
      </div>

      {stats && Object.keys(stats.mealCounts).length > 0 && (
        <div className="rounded-2xl border border-gray-200 p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-4">
            Meal preferences
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(stats.mealCounts).map(([meal, count]) => (
              <div
                key={meal}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
              >
                <span className="text-[14px] capitalize text-gray-600">
                  {meal}
                </span>
                <span className="text-[16px] font-semibold text-gray-900">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
