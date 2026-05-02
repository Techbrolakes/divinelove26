"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Mail,
  CheckCircle2,
  Clock,
  Trash2,
  Send,
  Search,
  Users,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { useTRPC } from "@/lib/trpc";
import { timeAgo } from "@/lib/format";

type Filter = "all" | "pending" | "invited" | "arrived";

const PAGE_SIZE = 25;

export default function RegistrationsPage() {
  const trpc = useTRPC();
  const qc = useQueryClient();

  const { data: guests, isLoading } = useQuery(
    trpc.admin.getGuests.queryOptions(),
  );

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: trpc.admin.getGuests.queryKey() });
    qc.invalidateQueries({ queryKey: trpc.admin.getStats.queryKey() });
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
      setPendingDelete(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  const summary = useMemo(() => {
    const list = guests ?? [];
    const invited = list.filter((g) => !!g.invitationSentAt).length;
    const arrived = list.filter((g) => !!g.checkedInAt).length;
    return {
      total: list.length,
      pending: list.length - invited,
      invited,
      arrived,
    };
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
      if (filter === "invited") return !!g.invitationSentAt && !g.checkedInAt;
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageEnd);
  const showingFrom = filtered.length === 0 ? 0 : pageStart + 1;
  const showingTo = Math.min(pageEnd, filtered.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-warm-500">
          Guest list
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-sans text-[28px] md:text-[32px] font-medium text-royal-dark leading-none tracking-tight">
            Registrations
          </h1>
          <p className="font-sans text-[13px] text-gray-500">
            Send invitations and track delivery status.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryStat
          icon={Users}
          label="Total"
          value={summary.total}
          total={summary.total}
          tone="neutral"
        />
        <SummaryStat
          icon={Clock}
          label="Pending"
          value={summary.pending}
          total={summary.total}
          tone="amber"
        />
        <SummaryStat
          icon={Mail}
          label="Invited"
          value={summary.invited}
          total={summary.total}
          tone="royal"
        />
        <SummaryStat
          icon={CheckCircle2}
          label="Checked in"
          value={summary.arrived}
          total={summary.total}
          tone="green"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex overflow-x-auto rounded-lg border border-gray-200 bg-white p-0.5">
          {filterTabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-3.5 py-1.5 font-sans text-[12px] font-medium transition-all whitespace-nowrap ${
                  active
                    ? "bg-royal text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded px-1.5 text-[10px] tabular-nums ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email..."
            className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 font-sans text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-royal/40 focus:ring-2 focus:ring-royal-50 transition-colors"
          />
        </div>
      </div>

      {/* Mobile — card list */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-royal-100 bg-white p-4 shadow-[0_1px_2px_rgba(11,61,145,0.04)]"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
              <div className="mt-4 h-9 w-full animate-pulse rounded-lg bg-gray-100" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-royal-100 bg-white px-6 py-14 text-center shadow-[0_1px_2px_rgba(11,61,145,0.04)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-royal-50 text-royal/60">
              <Send className="h-4 w-4" />
            </div>
            <p className="font-sans text-[14px] font-semibold text-gray-700">
              {query || filter !== "all"
                ? "No matches"
                : "No registrations yet"}
            </p>
            <p className="mt-1 font-sans text-[12px] text-gray-400">
              {query || filter !== "all"
                ? "Try a different filter or search term."
                : "Share the RSVP link with your guests."}
            </p>
          </div>
        ) : (
          paginated.map((g) => {
            const invited = !!g.invitationSentAt;
            const busy = sendInvitation.isPending && pendingId === g.id;
            const initials = g.fullName
              .split(" ")
              .map((s) => s[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={g.id}
                className="group relative overflow-hidden rounded-xl border border-royal-100 bg-white shadow-[0_1px_2px_rgba(11,61,145,0.04)] transition-shadow hover:shadow-[0_4px_14px_rgba(11,61,145,0.08)]"
              >
                {/* Accent stripe */}
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-0.5 ${
                    g.checkedInAt
                      ? "bg-green-500"
                      : invited
                        ? "bg-royal"
                        : "bg-amber-400"
                  }`}
                />

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-royal to-royal-dark text-white font-sans text-[12px] font-semibold ring-2 ring-white shadow-[0_2px_6px_rgba(11,61,145,0.18)]">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-[14.5px] font-semibold text-gray-900 truncate leading-tight">
                        {g.fullName}
                      </p>
                      <p className="mt-0.5 font-sans text-[12.5px] text-gray-500 truncate">
                        {g.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPendingDelete({ id: g.id, name: g.fullName })
                      }
                      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <StatusBadge
                      invitationSentAt={
                        g.invitationSentAt ? new Date(g.invitationSentAt) : null
                      }
                      checkedInAt={
                        g.checkedInAt ? new Date(g.checkedInAt) : null
                      }
                    />
                    <span
                      className="font-sans text-[11.5px] text-gray-400 tabular-nums"
                      title={new Date(g.createdAt).toLocaleString()}
                    >
                      Registered {timeAgo(new Date(g.createdAt))}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingId(g.id);
                      sendInvitation.mutate({ guestId: g.id });
                    }}
                    disabled={busy}
                    className={`inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-sans text-[12.5px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      invited
                        ? "border border-gray-200 bg-white text-gray-700 hover:border-royal/40 hover:text-royal"
                        : "bg-royal text-white hover:bg-royal-dark"
                    }`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {busy
                      ? "Sending…"
                      : invited
                        ? "Resend invitation"
                        : "Send invitation"}
                  </button>
                </div>
              </div>
            );
          })
        )}

        {!isLoading && filtered.length > 0 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            showingFrom={showingFrom}
            showingTo={showingTo}
            total={filtered.length}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Desktop — table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-royal-100 bg-white shadow-[0_1px_2px_rgba(11,61,145,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-royal-100 bg-gradient-to-r from-royal-50 via-royal-50/80 to-royal-50">
                <Th className="w-[32%]">Guest</Th>
                <Th className="w-[26%]">Email</Th>
                <Th className="w-[18%]">Status</Th>
                <Th className="w-[14%]">Registered</Th>
                <Th className="text-right w-[10%]">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[0, 1, 2, 3, 4].map((c) => (
                      <td key={c} className="px-4 py-4">
                        <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-royal-50 text-royal/60">
                      <Send className="h-4 w-4" />
                    </div>
                    <p className="font-sans text-[14px] font-semibold text-gray-700">
                      {query || filter !== "all"
                        ? "No matches"
                        : "No registrations yet"}
                    </p>
                    <p className="mt-1 font-sans text-[12px] text-gray-400">
                      {query || filter !== "all"
                        ? "Try a different filter or search term."
                        : "Share the RSVP link with your guests."}
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((g) => {
                  const invited = !!g.invitationSentAt;
                  const checkedIn = !!g.checkedInAt;
                  const busy = sendInvitation.isPending && pendingId === g.id;
                  const initials = g.fullName
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr
                      key={g.id}
                      className="hover:bg-royal-50/40 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-royal to-royal-dark text-white font-sans text-[11px] font-semibold ring-2 ring-white shadow-[0_2px_6px_rgba(11,61,145,0.18)]">
                            {initials}
                          </div>
                          <p className="font-sans text-[13.5px] font-semibold text-gray-900 truncate">
                            {g.fullName}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-sans text-[13px] text-gray-600 truncate">
                          {g.email}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          invitationSentAt={
                            g.invitationSentAt
                              ? new Date(g.invitationSentAt)
                              : null
                          }
                          checkedInAt={
                            g.checkedInAt ? new Date(g.checkedInAt) : null
                          }
                        />
                      </td>
                      <td className="px-4 py-4">
                        <p
                          className="font-sans text-[12.5px] text-gray-500 tabular-nums"
                          title={new Date(g.createdAt).toLocaleString()}
                        >
                          {timeAgo(new Date(g.createdAt))}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPendingId(g.id);
                              sendInvitation.mutate({ guestId: g.id });
                            }}
                            disabled={busy}
                            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 font-sans text-[11.5px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              invited
                                ? "border border-gray-200 bg-white text-gray-700 hover:border-royal/40 hover:text-royal"
                                : "bg-royal text-white hover:bg-royal-dark"
                            }`}
                            title={
                              invited ? "Resend invitation" : "Send invitation"
                            }
                          >
                            <Mail className="h-3.5 w-3.5" />
                            {busy ? "Sending…" : invited ? "Resend" : "Send"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPendingDelete({
                                id: g.id,
                                name: g.fullName,
                              })
                            }
                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Remove"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filtered.length > 0 && (
          <div className="border-t border-royal-100 bg-royal-50/50 px-4 py-2.5">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              showingFrom={showingFrom}
              showingTo={showingTo}
              total={filtered.length}
              onPageChange={setPage}
              compact
            />
          </div>
        )}
      </div>

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleteGuest.isPending) setPendingDelete(null);
        }}
      >
        <DialogContent
          hideDefaultClose
          className="gap-0 p-0 sm:max-w-[420px] rounded-xl border-royal-100 shadow-[0_20px_50px_-12px_rgba(11,61,145,0.25)]"
        >
          <DialogHeader className="flex flex-col items-center gap-4 px-6 pt-8 pb-2 text-center sm:text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
              <AlertTriangle className="h-6 w-6 text-red-600" strokeWidth={2} />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <DialogTitle className="font-sans text-[17px] font-semibold text-gray-900">
                Remove registration?
              </DialogTitle>
              <DialogDescription className="font-sans text-[13px] leading-relaxed text-gray-500">
                <span className="font-semibold text-gray-900">
                  {pendingDelete?.name}
                </span>{" "}
                will be removed from the registration list along with any
                associated RSVP. This action cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="mt-6 grid grid-cols-2 gap-2 border-t border-gray-100 bg-gray-50/50 px-6 py-4 sm:flex-row sm:justify-stretch sm:space-x-0">
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              disabled={deleteGuest.isPending}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-4 font-sans text-[12.5px] font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (pendingDelete) {
                  deleteGuest.mutate({ guestId: pendingDelete.id });
                }
              }}
              disabled={deleteGuest.isPending}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 font-sans text-[12.5px] font-semibold text-white shadow-[0_1px_2px_rgba(220,38,38,0.25)] transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {deleteGuest.isPending ? "Removing…" : "Remove"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  showingFrom,
  showingTo,
  total,
  onPageChange,
  compact = false,
}: {
  page: number;
  totalPages: number;
  showingFrom: number;
  showingTo: number;
  total: number;
  onPageChange: (next: number) => void;
  compact?: boolean;
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div
      className={`flex items-center justify-between gap-3 ${
        compact ? "" : "pt-1"
      }`}
    >
      <p className="font-sans text-[11.5px] text-royal-dark/70 tabular-nums">
        Showing{" "}
        <span className="font-semibold text-royal-dark">
          {showingFrom}–{showingTo}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-royal-dark">{total}</span>{" "}
        {total === 1 ? "registration" : "registrations"}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-royal-100 bg-white text-royal-dark transition-colors hover:bg-royal-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="font-sans text-[11.5px] font-medium text-royal-dark/80 tabular-nums px-1">
          Page <span className="font-semibold text-royal-dark">{page}</span>{" "}
          of <span className="font-semibold text-royal-dark">{totalPages}</span>
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-royal-100 bg-white text-royal-dark transition-colors hover:bg-royal-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          aria-label="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-left font-sans text-[10.5px] font-semibold uppercase tracking-[0.16em] text-royal-dark ${className}`}
    >
      {children}
    </th>
  );
}

function StatusBadge({
  invitationSentAt,
  checkedInAt,
}: {
  invitationSentAt: Date | null;
  checkedInAt: Date | null;
}) {
  if (checkedInAt) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-2 py-1 font-sans text-[11px] font-semibold text-green-700 ring-1 ring-inset ring-green-200"
        title={`Checked in at ${checkedInAt.toLocaleString()}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
        Checked in · {timeAgo(checkedInAt)}
      </span>
    );
  }

  if (invitationSentAt) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-md bg-royal-50 px-2 py-1 font-sans text-[11px] font-semibold text-royal-dark ring-1 ring-inset ring-royal-100"
        title={`Email sent on ${invitationSentAt.toLocaleString()}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-royal" />
        Sent · {timeAgo(invitationSentAt)}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 font-sans text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200"
      title="No invitation sent yet"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Pending
    </span>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
  total,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  total: number;
  tone: "neutral" | "amber" | "royal" | "green";
}) {
  const tones = {
    neutral: {
      iconWrap:
        "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600 ring-1 ring-inset ring-gray-200/60",
      bar: "bg-gray-300",
      track: "bg-gray-100",
      glow: "from-gray-50/0 via-gray-50/0 to-gray-50/40",
    },
    amber: {
      iconWrap:
        "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/70",
      bar: "bg-amber-500",
      track: "bg-amber-100/60",
      glow: "from-amber-50/0 via-amber-50/0 to-amber-50/60",
    },
    royal: {
      iconWrap:
        "bg-gradient-to-br from-royal-100 to-royal-50 text-royal ring-1 ring-inset ring-royal-100",
      bar: "bg-royal",
      track: "bg-royal-50",
      glow: "from-royal-50/0 via-royal-50/0 to-royal-50/60",
    },
    green: {
      iconWrap:
        "bg-gradient-to-br from-green-100 to-green-50 text-green-700 ring-1 ring-inset ring-green-200/70",
      bar: "bg-green-500",
      track: "bg-green-100/60",
      glow: "from-green-50/0 via-green-50/0 to-green-50/60",
    },
  } as const;
  const t = tones[tone];

  const pct =
    tone === "neutral" || total === 0
      ? 0
      : Math.min(100, Math.round((value / total) * 100));
  const showBar = tone !== "neutral" && total > 0;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(11,61,145,0.04)] transition-all hover:border-gray-300 hover:shadow-[0_4px_14px_rgba(11,61,145,0.08)]">
      {/* Soft corner glow */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${t.glow} blur-2xl`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-gray-500">
            {label}
          </p>
          <p className="mt-1.5 font-sans text-[26px] font-semibold leading-none tracking-tight text-gray-900 tabular-nums">
            {value}
          </p>
        </div>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${t.iconWrap}`}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
      </div>

      {showBar ? (
        <div className="relative mt-4">
          <div className={`h-1 w-full overflow-hidden rounded-full ${t.track}`}>
            <div
              className={`h-full rounded-full ${t.bar} transition-[width] duration-500 ease-out`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 font-sans text-[10.5px] text-gray-400 tabular-nums">
            {pct}% of total
          </p>
        </div>
      ) : (
        <p className="relative mt-4 font-sans text-[10.5px] text-gray-400">
          {total === 1 ? "registration" : "registrations"}
        </p>
      )}
    </div>
  );
}
