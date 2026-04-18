"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import {
  CheckCircle2,
  KeyRound,
  QrCode,
  XCircle,
  RotateCcw,
  Mail,
  Users,
  ShieldCheck,
} from "lucide-react";
import { useTRPC } from "@/lib/trpc";

type Mode = "scan" | "manual";

interface ValidatedGuest {
  id: string;
  fullName: string;
  email: string;
  checkedInAt: Date | null;
}

export default function ValidatePage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery(trpc.admin.getStats.queryOptions());

  const [mode, setMode] = useState<Mode>("scan");
  const [manualCode, setManualCode] = useState("");
  const [result, setResult] = useState<
    | { kind: "success"; guest: ValidatedGuest }
    | { kind: "error"; message: string }
    | null
  >(null);
  const [scanLocked, setScanLocked] = useState(false);

  const validate = useMutation({
    ...trpc.admin.validateCode.mutationOptions(),
    onSuccess: (guest) => {
      setResult({ kind: "success", guest });
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getStats.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.admin.getGuests.queryKey(),
      });
    },
    onError: (err) => {
      setResult({ kind: "error", message: err.message });
    },
  });

  function tryCode(code: string) {
    const trimmed = code.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      setResult({ kind: "error", message: "Code must be 6 digits." });
      return;
    }
    setResult(null);
    validate.mutate({ code: trimmed });
  }

  function onScan(detected: IDetectedBarcode[]) {
    if (scanLocked) return;
    const payload = detected[0]?.rawValue;
    if (!payload) return;
    setScanLocked(true);
    tryCode(payload);
  }

  function reset() {
    setResult(null);
    setManualCode("");
    setScanLocked(false);
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
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
              Door check-in
            </p>
            <h1 className="font-serif italic font-light text-white text-[36px] md:text-[42px] leading-none">
              Validate invitation
            </h1>
            <p className="mt-3 font-sans text-sm text-white/70 max-w-lg">
              Scan a guest&apos;s QR code or type their 6-digit code. Each
              code can only be used once.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <MiniStat
              icon={Users}
              label="Registered"
              value={stats?.total ?? 0}
            />
            <MiniStat
              icon={Mail}
              label="Invited"
              value={stats?.invited ?? 0}
            />
            <MiniStat
              icon={ShieldCheck}
              label="Arrived"
              value={stats?.checkedIn ?? 0}
            />
          </div>
        </div>
      </div>

      {/* Main column */}
      <div className="mx-auto max-w-xl space-y-6">
        {/* Mode toggle */}
        <div className="flex rounded-full border border-gray-100 bg-white p-1 font-sans text-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <button
            type="button"
            onClick={() => {
              setMode("scan");
              reset();
            }}
            className={`flex-1 cursor-pointer inline-flex items-center justify-center gap-2 rounded-full py-2.5 font-sans uppercase tracking-[0.15em] transition-all ${
              mode === "scan"
                ? "bg-gradient-to-br from-royal to-royal-dark text-white shadow-[0_2px_8px_rgba(11,61,145,0.25)]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <QrCode className="h-4 w-4" />
            Scan QR
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("manual");
              reset();
            }}
            className={`flex-1 cursor-pointer inline-flex items-center justify-center gap-2 rounded-full py-2.5 font-sans uppercase tracking-[0.15em] transition-all ${
              mode === "manual"
                ? "bg-gradient-to-br from-royal to-royal-dark text-white shadow-[0_2px_8px_rgba(11,61,145,0.25)]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <KeyRound className="h-4 w-4" />
            Enter code
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "scan" && !result && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl border border-gray-100 bg-royal-dark shadow-[0_10px_40px_-12px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-sm px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/90">
                  Scanning
                </span>
              </div>

              <Scanner
                onScan={onScan}
                constraints={{ facingMode: "environment" }}
                scanDelay={400}
                components={{
                  finder: true,
                  torch: true,
                }}
                classNames={{ container: "aspect-square w-full" }}
              />

              <div className="px-5 py-3 bg-royal-dark border-t border-white/10">
                <p className="font-sans text-[11px] text-white/60 text-center">
                  Hold the guest&apos;s QR code steady inside the frame
                </p>
              </div>
            </motion.div>
          )}

          {mode === "manual" && !result && (
            <motion.form
              key="manual"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              onSubmit={(e) => {
                e.preventDefault();
                tryCode(manualCode);
              }}
              className="space-y-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.08)]"
            >
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-royal-50 to-royal-100/60 ring-1 ring-royal-100">
                  <KeyRound className="h-5 w-5 text-royal" strokeWidth={1.75} />
                </div>
                <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-1">
                  Invitation code
                </p>
                <p className="font-serif italic text-lg text-royal-dark">
                  Enter the 6-digit code
                </p>
              </div>

              <input
                value={manualCode}
                onChange={(e) =>
                  setManualCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                placeholder="000000"
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-5 text-center font-serif text-[44px] tracking-[0.4em] text-royal-dark outline-none focus:border-royal focus:bg-white focus:ring-4 focus:ring-royal/10 transition-all"
              />

              <button
                type="submit"
                disabled={manualCode.length !== 6 || validate.isPending}
                className="group relative w-full cursor-pointer overflow-hidden rounded-full bg-gradient-to-br from-royal to-royal-dark px-4 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_10px_30px_-10px_rgba(11,61,145,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(11,61,145,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative">
                  {validate.isPending ? "Checking..." : "Validate code"}
                </span>
              </button>
            </motion.form>
          )}

          {result?.kind === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <SuccessCard guest={result.guest} onReset={reset} />
            </motion.div>
          )}

          {result?.kind === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <ErrorCard message={result.message} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MiniStat({
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

function SuccessCard({
  guest,
  onReset,
}: {
  guest: ValidatedGuest;
  onReset: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-l-[4px] border border-gray-100 border-l-green-500 bg-white p-8 text-center shadow-[0_10px_40px_-12px_rgba(34,197,94,0.25)]">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-[0_10px_30px_-10px_rgba(34,197,94,0.5)]"
      >
        <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={2} />
      </motion.div>
      <p className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-green-700 mb-2">
        Checked in
      </p>
      <h2 className="font-serif italic text-[32px] text-royal-dark font-light leading-tight">
        {guest.fullName}
      </h2>
      <p className="mt-1 font-sans text-[13px] text-gray-500">{guest.email}</p>
      {guest.checkedInAt && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <p className="font-sans text-[11px] font-medium text-green-700">
            Arrived at{" "}
            {new Date(guest.checkedInAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-br from-royal to-royal-dark px-6 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white hover:from-royal-light hover:to-royal transition-all shadow-[0_4px_12px_rgba(11,61,145,0.25)]"
      >
        <RotateCcw className="h-4 w-4" />
        Validate next guest
      </button>
    </div>
  );
}

function ErrorCard({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-l-[4px] border border-gray-100 border-l-red-500 bg-white p-8 text-center shadow-[0_10px_40px_-12px_rgba(239,68,68,0.15)]">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-[0_10px_30px_-10px_rgba(239,68,68,0.4)]"
      >
        <XCircle className="h-10 w-10 text-white" strokeWidth={2} />
      </motion.div>
      <p className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-red-700 mb-2">
        Not accepted
      </p>
      <p className="font-serif italic text-[22px] text-red-900 font-light leading-snug max-w-sm mx-auto">
        {message}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
