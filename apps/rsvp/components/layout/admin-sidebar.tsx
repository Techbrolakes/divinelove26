"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";
import { clearAuthToken } from "@/lib/auth";
import {
  SquaresFourIcon,
  UsersIcon,
  QrCodeIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretRightIcon,
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
  { href: "/admin/guests", label: "Registrations", icon: UsersIcon },
  { href: "/admin/validate", label: "Validate Code", icon: QrCodeIcon },
];

const navItemBase =
  "group relative flex w-full items-center rounded-xl text-[13px] font-medium transition-all cursor-pointer";
const navItemActive =
  "bg-gradient-to-r from-white/15 to-white/5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";
const navItemInactive = "text-white/60 hover:bg-white/5 hover:text-white";

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
      <div className="flex h-full flex-col text-white">
        {/* Brand header */}
        <div
          className={cn(
            "flex shrink-0 items-center px-5 py-5 border-b border-white/10",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed ? (
            <>
              <Link
                href="/admin"
                className="flex items-center gap-3 min-w-0 cursor-pointer"
              >
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/20 bg-white/10">
                  <Image
                    src="/logo/monogram-white-on-blue.jpeg"
                    alt="Divine Love 26"
                    width={44}
                    height={44}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="font-sans text-[8px] tracking-[0.35em] uppercase text-white/50 truncate">
                    Divine Love 26
                  </span>
                  <span
                    className="font-serif italic text-white text-[22px] leading-none mt-0.5"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    Ikhioya &amp; Idah
                  </span>
                </div>
              </Link>
              {!isMobile && onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                  title="Collapse sidebar"
                >
                  <CaretDoubleLeftIcon size={14} weight="bold" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Link
                href="/admin"
                aria-label="Dashboard"
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full ring-1 ring-white/20 bg-white/10"
              >
                <Image
                  src="/logo/monogram-white-on-blue.jpeg"
                  alt="Admin"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </Link>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                  title="Expand sidebar"
                >
                  <CaretDoubleRightIcon size={14} weight="bold" />
                </button>
              )}
            </div>
          )}

          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Close sidebar"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {!collapsed && (
            <p className="mb-3 px-3 font-sans text-[9px] tracking-[0.3em] uppercase text-white/40">
              Manage
            </p>
          )}
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    navItemBase,
                    collapsed
                      ? "justify-center px-2 py-2.5"
                      : "gap-3 px-2.5 py-2.5",
                    active ? navItemActive : navItemInactive,
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {active && !collapsed && (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-white" />
                  )}
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                      active
                        ? "bg-white/15 text-white"
                        : "bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white",
                    )}
                  >
                    <item.icon
                      size={16}
                      weight={active ? "fill" : "regular"}
                    />
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 tracking-[0.02em]">
                        {item.label}
                      </span>
                      <CaretRightIcon
                        size={12}
                        weight="bold"
                        className={cn(
                          "shrink-0 transition-all",
                          active
                            ? "text-white/80 translate-x-0"
                            : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-white/60",
                        )}
                      />
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom — profile + logout */}
        <div className="shrink-0 border-t border-white/10 px-3 py-4">
          {showLogoutConfirm && !collapsed && (
            <div className="mb-3 rounded-lg border border-white/15 bg-white/5 p-3">
              <p className="font-sans text-[12px] font-medium text-white">
                Sign out?
              </p>
              <div className="mt-2.5 flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 cursor-pointer rounded-md border border-white/20 bg-transparent px-3 py-1.5 font-sans text-[12px] text-white/80 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 cursor-pointer rounded-md bg-white px-3 py-1.5 font-sans text-[12px] font-semibold text-royal-dark hover:bg-royal-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}

          {adminName && !collapsed && (
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-royal-dark">
                {initials}
              </div>
              <div className="flex flex-1 flex-col min-w-0">
                <p className="truncate font-sans text-[13px] font-semibold text-white">
                  {adminName}
                </p>
                <p className="truncate font-sans text-[10px] tracking-wider uppercase text-white/50">
                  Administrator
                </p>
              </div>
              <button
                onClick={() => setShowLogoutConfirm((v) => !v)}
                className={cn(
                  "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors",
                  showLogoutConfirm
                    ? "bg-white/10 text-red-300"
                    : "text-white/60 hover:bg-white/10 hover:text-red-300",
                )}
                title="Sign out"
              >
                <SignOutIcon size={16} weight="bold" />
              </button>
            </div>
          )}
          {adminName && collapsed && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-royal-dark">
                {initials}
              </div>
              <button
                onClick={handleLogout}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-red-300 transition-colors"
                title="Sign out"
              >
                <SignOutIcon size={16} weight="bold" />
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
          "hidden shrink-0 md:flex md:flex-col fixed inset-y-0 left-0 z-30 bg-royal-dark border-r border-white/5 transition-all duration-300",
          isCollapsed ? "w-[72px]" : "w-[260px]",
        )}
      >
        {renderSidebarContent(!!isCollapsed, false)}
      </aside>

      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-royal-dark/40 backdrop-blur-[2px] md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] shrink-0 bg-royal-dark md:hidden flex flex-col transform transition-transform duration-300 ease-in-out border-r border-white/5",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {renderSidebarContent(false, true)}
      </aside>
    </>
  );
}
