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
      {/* Welcome panel */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-royal via-royal-dark to-[#041d4a] p-8 md:p-10 text-white shadow-[0_10px_40px_-12px_rgba(11,61,145,0.25)]">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-white/50 mb-2">
              Dashboard
            </p>
            <h1 className="font-serif italic font-light text-white text-[36px] md:text-[42px] leading-none">
              Welcome, {firstName}
            </h1>
            <p className="mt-3 font-sans text-[14px] text-white/70 max-w-md">
              Manage registrations, send invitations, and check guests in at
              Idah &amp; Ikhioya&apos;s wedding.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/guests"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-royal-dark hover:bg-royal-50 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Registrations
            </Link>
            <Link
              href="/admin/validate"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-white hover:bg-white/20 transition-colors"
            >
              <QrCode className="h-4 w-4" />
              Validate
            </Link>
          </div>
        </div>
      </div>

      {/* Share invite link */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-royal-50 to-royal-100/60 ring-1 ring-royal-100">
            <Link2 className="h-5 w-5 text-royal" strokeWidth={1.75} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-1">
              Public invite page
            </p>
            <p className="font-serif text-[18px] text-royal-dark leading-tight">
              Share this link with your guests
            </p>
            <p className="mt-1 font-sans text-[12px] text-gray-500 truncate">
              {displayUrl}
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={copyInviteLink}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-700 hover:border-royal/30 hover:text-royal-dark transition-colors"
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
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-br from-royal to-royal-dark px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-white shadow-[0_4px_12px_rgba(11,61,145,0.25)] hover:from-royal-light hover:to-royal transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open
            </Link>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Registered"
          value={String(stats?.total ?? 0)}
          icon={Users}
          description="Filled the RSVP form"
          isLoading={isLoading}
        />
        <StatCard
          title="Invitations sent"
          value={String(stats?.invited ?? 0)}
          icon={Mail}
          description={`${invitedPct}% of registrations`}
          isLoading={isLoading}
        />
        <StatCard
          title="Pending"
          value={String(stats?.pending ?? 0)}
          icon={Clock}
          description="Awaiting invitation"
          isLoading={isLoading}
        />
        <StatCard
          title="Checked in"
          value={String(stats?.checkedIn ?? 0)}
          icon={CheckCircle2}
          description={`${checkedInPct}% of invited`}
          isLoading={isLoading}
        />
      </div>

      {/* Quick links row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/guests"
          className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-royal/30 hover:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-royal-50 group-hover:bg-royal-100 transition-colors">
              <Users className="h-5 w-5 text-royal" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-serif text-[20px] text-royal-dark leading-tight">
                View registrations
              </p>
              <p className="font-sans text-[12px] text-gray-500 mt-0.5">
                Manage guests &amp; send invitations
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-royal group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/validate"
          className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-royal/30 hover:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-royal-50 group-hover:bg-royal-100 transition-colors">
              <QrCode className="h-5 w-5 text-royal" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-serif text-[20px] text-royal-dark leading-tight">
                Validate at the door
              </p>
              <p className="font-sans text-[12px] text-gray-500 mt-0.5">
                Scan or type invitation codes
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-royal group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
