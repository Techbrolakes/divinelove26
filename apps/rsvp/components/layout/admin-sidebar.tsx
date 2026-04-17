"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";
import { clearAuthToken } from "@/lib/auth";
import {
  SquaresFourIcon,
  UsersIcon,
  GearIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  XIcon,
  SignOutIcon,
  type IconProps,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

type PhosphorIcon = ComponentType<IconProps>;

interface NavItem {
  href: string;
  label: string;
  icon: PhosphorIcon;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: SquaresFourIcon },
  { href: "/admin/guests", label: "Guests", icon: UsersIcon },
];

void GearIcon;

const navItemBase =
  "group flex w-full items-center rounded-full p-2 text-[16px] font-medium transition-colors cursor-pointer";
const navItemActive = "bg-gray-100 text-gray-900 font-medium";
const navItemInactive = "text-gray-500 hover:bg-gray-100 hover:text-gray-900";

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  adminName?: string;
}

export function AdminSidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  adminName,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const initials = adminName
    ? adminName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  function handleLogout() {
    clearAuthToken();
    router.push("/admin/login");
  }

  function renderSidebarContent(collapsed: boolean, isMobile: boolean) {
    return (
      <div className="flex h-full flex-col">
        {/* Header */}
        <div
          className={cn(
            "flex shrink-0 items-center px-5 py-5",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed ? (
            <>
              <Link href="/admin" className="flex items-center gap-1.5">
                <span className="text-[18px] font-bold text-gray-900">
                  Admin
                </span>
              </Link>
              {!isMobile && onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="cursor-pointer flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  title="Collapse sidebar"
                >
                  <CaretDoubleLeftIcon size={16} weight="bold" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Link href="/admin">
                <span className="text-[18px] font-bold text-gray-900">A</span>
              </Link>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="cursor-pointer flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  title="Expand sidebar"
                >
                  <CaretDoubleRightIcon size={16} weight="bold" />
                </button>
              )}
            </div>
          )}

          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="cursor-pointer flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    navItemBase,
                    collapsed ? "justify-center" : "gap-1.5",
                    active ? navItemActive : navItemInactive,
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon
                    size={20}
                    weight={active ? "fill" : "light"}
                    className="shrink-0"
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="shrink-0 px-5 pb-5">
          {/* Logout Confirmation */}
          {showLogoutConfirm && !collapsed && (
            <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <p className="text-[13px] font-medium text-gray-900">
                Are you sure you want to log out?
              </p>
              <div className="mt-2.5 flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="cursor-pointer flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer flex-1 rounded-lg bg-red-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Log out
                </button>
              </div>
            </div>
          )}

          {/* User Profile */}
          {adminName && !collapsed && (
            <div className="flex items-center gap-3.5 mt-2">
              <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-[14px] font-semibold text-gray-900">
                {initials}
              </div>
              <div className="flex flex-1 flex-col min-w-0">
                <p className="truncate text-[14px] font-semibold text-gray-900">
                  {adminName}
                </p>
              </div>
              <button
                onClick={() => setShowLogoutConfirm((v) => !v)}
                className={cn(
                  "cursor-pointer flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  showLogoutConfirm
                    ? "bg-gray-100 text-red-600"
                    : "text-gray-500 hover:bg-gray-100 hover:text-red-600",
                )}
                title="Log out"
              >
                <SignOutIcon size={18} weight="bold" />
              </button>
            </div>
          )}
          {adminName && collapsed && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-[14px] font-semibold text-gray-900">
                {initials}
              </div>
              <button
                onClick={handleLogout}
                className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors"
                title="Log out"
              >
                <SignOutIcon size={18} weight="bold" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 bg-white md:flex md:flex-col fixed inset-y-0 left-0 z-30 border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-[72px]" : "w-[250px]",
        )}
      >
        {renderSidebarContent(!!isCollapsed, false)}
      </aside>

      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] shrink-0 bg-white md:hidden flex flex-col transform transition-transform duration-300 ease-in-out border-r border-gray-200",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {renderSidebarContent(false, true)}
      </aside>
    </>
  );
}
