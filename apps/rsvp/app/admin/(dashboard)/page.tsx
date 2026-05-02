"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Users,
  Mail,
  CheckCircle2,
  Clock,
  QrCode,
  UserPlus,
  ArrowRight,
  Link2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useAdminMe } from "@/features/auth/use-auth";
import { useTRPC } from "@/lib/trpc";
import { StatCard } from "@/components/shared/stat-card";

export default function DashboardPage() {
  const { data: admin } = useAdminMe();
  const firstName = admin?.firstName || "Admin";

  const trpc = useTRPC();
  const { data: stats, isLoading } = useQuery(
    trpc.admin.getStats.queryOptions(),
  );

  const invitedPct =
    stats && stats.total > 0
      ? Math.round((stats.invited / stats.total) * 100)
      : 0;
  const checkedInPct =
    stats && stats.invited > 0
      ? Math.round((stats.checkedIn / stats.invited) * 100)
      : 0;

  const [copied, setCopied] = useState(false);
  const rsvpPath = "/";
  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${rsvpPath}`
      : rsvpPath;
  const displayUrl = inviteUrl.replace(/^https?:\/\//, "");

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("Invite link copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — please copy manually");
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome hero */}
      <div
        className="relative overflow-hidden rounded-2xl border border-royal-100 px-6 py-6 md:px-8 md:py-7"
        style={{
          backgroundImage:
            "radial-gradient(800px 400px at 110% -20%, rgba(255,215,148,0.18), transparent 60%), radial-gradient(600px 300px at -10% 120%, rgba(11,61,145,0.10), transparent 60%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-royal/20 to-transparent"
        />
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-royal/70">
              Dashboard
            </p>
            <h1 className="mt-2 font-sans text-[28px] md:text-[34px] font-medium text-royal-dark leading-none tracking-tight">
              Welcome, {firstName}
            </h1>
            <p className="mt-2 font-sans text-[13px] text-gray-500 max-w-xl">
              Manage registrations, send invitations, and check guests in for
              Idah &amp; Ikhioya&apos;s wedding.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/guests"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-royal px-3.5 py-2 font-sans text-[12px] font-semibold text-white shadow-[0_1px_2px_rgba(11,61,145,0.25)] hover:bg-royal-dark transition-colors"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Registrations
            </Link>
            <Link
              href="/admin/validate"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 font-sans text-[12px] font-semibold text-gray-700 hover:border-royal/40 hover:text-royal transition-colors"
            >
              <QrCode className="h-3.5 w-3.5" />
              Validate
            </Link>
          </div>
        </div>
      </div>

      {/* Share invite link */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-4 md:p-5 shadow-[0_1px_2px_rgba(11,61,145,0.04)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-royal-100 to-royal-50 text-royal ring-1 ring-inset ring-royal-100">
              <Link2 className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-sans text-[10.5px] font-semibold tracking-[0.18em] uppercase text-gray-500">
                  Public invite page
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-1.5 py-0.5 font-sans text-[9.5px] font-semibold text-green-700 ring-1 ring-inset ring-green-200">
                  <span className="h-1 w-1 rounded-full bg-green-500" />
                  Live
                </span>
              </div>
              <p className="mt-1 font-mono text-[12.5px] text-gray-700 truncate">
                {displayUrl}
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={copyInviteLink}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 font-sans text-[12px] font-semibold text-gray-700 hover:border-royal/40 hover:text-royal transition-colors"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy link"}
            </button>
            <Link
              href={rsvpPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-royal px-3 py-2 font-sans text-[12px] font-semibold text-white shadow-[0_1px_2px_rgba(11,61,145,0.25)] hover:bg-royal-dark transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open
            </Link>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Registered"
          value={String(stats?.total ?? 0)}
          icon={Users}
          description="Filled the RSVP form"
          isLoading={isLoading}
          tone="neutral"
        />
        <StatCard
          title="Invitations sent"
          value={String(stats?.invited ?? 0)}
          icon={Mail}
          description={`${invitedPct}% of registrations`}
          isLoading={isLoading}
          tone="royal"
          progress={invitedPct}
        />
        <StatCard
          title="Pending"
          value={String(stats?.pending ?? 0)}
          icon={Clock}
          description="Awaiting invitation"
          isLoading={isLoading}
          tone="amber"
          progress={
            stats && stats.total > 0 ? (stats.pending / stats.total) * 100 : 0
          }
        />
        <StatCard
          title="Checked in"
          value={String(stats?.checkedIn ?? 0)}
          icon={CheckCircle2}
          description={`${checkedInPct}% of invited`}
          isLoading={isLoading}
          tone="green"
          progress={checkedInPct}
        />
      </div>

      {/* Quick links */}
      <div>
        <p className="mb-3 font-sans text-[10px] tracking-[0.3em] uppercase text-gray-500">
          Quick actions
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <QuickLink
            href="/admin/guests"
            icon={Users}
            title="Registrations"
            subtitle="Guests & invitations"
          />
          <QuickLink
            href="/admin/validate"
            icon={QrCode}
            title="Validate at the door"
            subtitle="Scan or type codes"
          />
          <QuickLink
            href="/admin/team"
            icon={ShieldCheck}
            title="Team"
            subtitle="Add or remove admins"
          />
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  subtitle,
}: {
  href: string;
  icon: typeof Users;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-gray-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(11,61,145,0.04)] transition-all hover:border-royal/30 hover:shadow-[0_4px_14px_rgba(11,61,145,0.08)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-royal-50/0 via-royal-50/0 to-royal-50/60 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <div className="relative flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-royal-100 to-royal-50 text-royal ring-1 ring-inset ring-royal-100 transition-colors">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="font-sans text-[14px] font-semibold text-gray-900 leading-tight truncate">
            {title}
          </p>
          <p className="mt-0.5 font-sans text-[12px] text-gray-500 truncate">
            {subtitle}
          </p>
        </div>
      </div>
      <ArrowRight className="relative h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:text-royal group-hover:translate-x-1" />
    </Link>
  );
}
