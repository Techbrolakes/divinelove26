"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Trash2,
  Mail,
  MailCheck,
  CheckCircle2,
  Search,
  Users,
  Clock,
  Send,
} from "lucide-react";
import { useTRPC } from "@/lib/trpc";
import { timeAgo } from "@/lib/format";

type Filter = "all" | "pending" | "invited" | "arrived";

export default function RegistrationsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: guests, isLoading } = useQuery(
    trpc.admin.getGuests.queryOptions(),
  );

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: trpc.admin.getGuests.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: trpc.admin.getStats.queryKey(),
    });
  };

  const sendInvitation = useMutation({
    ...trpc.admin.sendInvitation.mutationOptions(),
    onSuccess: () => {
      toast.success("Invitation sent");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteGuest = useMutation({
    ...trpc.admin.deleteGuest.mutationOptions(),
    onSuccess: () => {
      toast.success("Registration removed");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const summary = useMemo(() => {
    const list = guests ?? [];
    const invited = list.filter((g) => !!g.invitationSentAt).length;
    const arrived = list.filter((g) => !!g.checkedInAt).length;
    const pending = list.length - invited;
    return { total: list.length, pending, invited, arrived };
  }, [guests]);

  const filtered = useMemo(() => {
    const list = guests ?? [];
    const q = query.trim().toLowerCase();
    return list.filter((g) => {
      const matchesQuery =
        !q ||
        g.fullName.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q);
      if (!matchesQuery) return false;

      if (filter === "pending") return !g.invitationSentAt;
      if (filter === "invited")
        return !!g.invitationSentAt && !g.checkedInAt;
      if (filter === "arrived") return !!g.checkedInAt;
      return true;
    });
  }, [guests, filter, query]);

  const filterTabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: summary.total },
    { key: "pending", label: "Pending", count: summary.pending },
    { key: "invited", label: "Invited", count: summary.invited },
    { key: "arrived", label: "Arrived", count: summary.arrived },
  ];

  return (
    <div className="space-y-8">
      {/* Hero panel */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-royal via-royal-dark to-[#041d4a] p-8 text-white shadow-[0_10px_40px_-12px_rgba(11,61,145,0.25)]">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-white/50 mb-2">
              Guest list
            </p>
            <h1 className="font-serif italic font-light text-white text-[36px] md:text-[42px] leading-none">
              Registrations
            </h1>
            <p className="mt-3 font-sans text-sm text-white/70 max-w-lg">
              Send invitations to deliver a code each guest will present at the
              door.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <SummaryPill icon={Users} label="Total" value={summary.total} />
            <SummaryPill
              icon={Clock}
              label="Pending"
              value={summary.pending}
            />
            <SummaryPill
              icon={CheckCircle2}
              label="Arrived"
              value={summary.arrived}
            />
          </div>
        </div>
      </div>

      {/* Filter + search bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex overflow-x-auto rounded-full border border-gray-100 bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {filterTabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 font-sans text-[12px] font-medium transition-all whitespace-nowrap ${
                  active
                    ? "bg-royal text-white shadow-[0_2px_8px_rgba(11,61,145,0.25)]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] tabular-nums ${
                    active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-full border border-gray-100 bg-white pl-11 pr-4 py-2.5 font-sans text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-royal/40 focus:ring-2 focus:ring-royal-50 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          />
        </div>
      </div>

      {/* Registration cards */}
      {isLoading && (
        <div className="grid gap-3">
          {[0, 1, 2, 3].map((i) => (
            <RegistrationSkeleton key={i} index={i} />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 px-6 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-50 to-royal-100/60 ring-1 ring-royal-100">
            <Send className="h-6 w-6 text-royal" strokeWidth={1.75} />
          </div>
          <p className="font-serif italic text-[26px] text-royal-dark font-light">
            {query || filter !== "all"
              ? "No matches"
              : "No registrations yet"}
          </p>
          <p className="mt-2 font-sans text-[13px] text-gray-500 max-w-sm mx-auto">
            {query || filter !== "all"
              ? "Try a different filter or search term."
              : "Share the RSVP link with your guests and they'll appear here as they register."}
          </p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid gap-3">
          {filtered.map((g) => {
            const invited = !!g.invitationSentAt;
            const checkedIn = !!g.checkedInAt;
            const busy = sendInvitation.isPending && pendingId === g.id;
            const initials = g.fullName
              .split(" ")
              .map((s) => s[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            const accent = checkedIn
              ? "border-l-green-500"
              : invited
                ? "border-l-royal"
                : "border-l-gray-200";

            return (
              <div
                key={g.id}
                className={`group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-gray-100 border-l-[4px] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-royal/30 hover:shadow-[0_12px_40px_-12px_rgba(11,61,145,0.15)] ${accent}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-royal to-royal-dark text-white font-serif text-[14px] font-semibold shadow-[0_4px_12px_rgba(11,61,145,0.25)]">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[18px] text-royal-dark leading-tight truncate">
                      {g.fullName}
                    </p>
                    <p className="font-sans text-[12px] text-gray-500 truncate">
                      {g.email}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 font-sans text-[10px] text-gray-500">
                        <Clock className="h-3 w-3" />
                        Registered {timeAgo(new Date(g.createdAt))}
                      </span>
                      {invited && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-royal-50 px-2 py-0.5 font-sans text-[10px] font-medium text-royal-dark">
                          <MailCheck className="h-3 w-3" />
                          Sent{" "}
                          {timeAgo(new Date(g.invitationSentAt as Date))}
                        </span>
                      )}
                      {checkedIn && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 font-sans text-[10px] font-medium text-green-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Arrived
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingId(g.id);
                      sendInvitation.mutate({ guestId: g.id });
                    }}
                    disabled={busy}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-br from-royal to-royal-dark px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-white hover:from-royal-light hover:to-royal disabled:opacity-60 transition-all shadow-[0_4px_12px_rgba(11,61,145,0.25)]"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {busy
                      ? "Sending..."
                      : invited
                        ? "Resend"
                        : "Send invitation"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          `Remove ${g.fullName} from the registration list?`,
                        )
                      ) {
                        deleteGuest.mutate({ guestId: g.id });
                      }
                    }}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SummaryPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm px-3 py-2.5 text-center">
      <div className="flex items-center justify-center gap-1.5 text-white/60 mb-0.5">
        <Icon className="h-3 w-3" />
        <span className="font-sans text-[9px] tracking-[0.2em] uppercase">
          {label}
        </span>
      </div>
      <p className="font-serif text-[22px] font-light leading-none tabular-nums">
        {value}
      </p>
    </div>
  );
}

function RegistrationSkeleton({ index }: { index: number }) {
  const widths = [
    { name: "w-40", email: "w-52" },
    { name: "w-32", email: "w-48" },
    { name: "w-48", email: "w-56" },
    { name: "w-36", email: "w-44" },
  ];
  const size = widths[index % widths.length]!;

  return (
    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden rounded-2xl border border-gray-100 border-l-[3px] border-l-gray-200 bg-white p-5">
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-100/70 to-transparent" />

      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="h-11 w-11 shrink-0 rounded-full bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className={`h-4 ${size.name} rounded bg-gray-100`} />
          <div className={`h-3 ${size.email} rounded bg-gray-100/80`} />
          <div className="flex gap-2 pt-1">
            <div className="h-4 w-24 rounded-full bg-gray-100" />
            <div className="h-4 w-20 rounded-full bg-gray-100/70" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 shrink-0">
        <div className="h-8 w-36 rounded-full bg-gray-100" />
        <div className="h-9 w-9 rounded-full bg-gray-100/70" />
      </div>
    </div>
  );
}
