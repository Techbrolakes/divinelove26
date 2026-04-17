"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import { AuthGuard } from "@/features/auth/auth-guard";
import { cn } from "@repo/ui/lib/utils";
import { useAdminMe } from "@/features/auth/use-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: admin } = useAdminMe();

  const adminName = admin
    ? `${admin.firstName} ${admin.lastName}`
    : undefined;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <AdminSidebar
          isCollapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          adminName={adminName}
        />
        <div
          className={cn(
            "transition-all duration-300",
            collapsed ? "md:ml-[72px]" : "md:ml-[250px]",
          )}
        >
          <AdminHeader onMenuClick={() => setMobileOpen(true)} />
          <main className="px-3 py-4 sm:px-6 sm:py-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
