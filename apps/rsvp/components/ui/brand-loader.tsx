"use client";

import Image from "next/image";
import { cn } from "@repo/ui/lib/utils";

interface BrandLoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
  onDark?: boolean;
}

const sizeMap = {
  sm: { box: 44, logo: 34, ring: 44 },
  md: { box: 68, logo: 56, ring: 68 },
  lg: { box: 96, logo: 80, ring: 96 },
};

export function BrandLoader({
  size = "md",
  label,
  className,
  onDark = false,
}: BrandLoaderProps) {
  const s = sizeMap[size];

  const ringColor = onDark
    ? "rgba(255,255,255,0.9)"
    : "rgba(11,61,145,1)"; // royal
  const ringTrack = onDark
    ? "rgba(255,255,255,0.12)"
    : "rgba(11,61,145,0.12)";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn("inline-flex flex-col items-center gap-4", className)}
    >
      <div
        className="relative inline-flex items-center justify-center"
        style={{ width: s.box, height: s.box }}
      >
        {/* Track ring (full, faint) */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `inset 0 0 0 1px ${ringTrack}`,
          }}
        />

        {/* Rotating arc ring */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full animate-brand-spin"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, transparent 290deg, ${ringColor} 358deg, ${ringColor} 360deg)`,
            WebkitMask:
              "radial-gradient(circle, transparent calc(50% - 1px), #000 calc(50% - 1px))",
            mask: "radial-gradient(circle, transparent calc(50% - 1px), #000 calc(50% - 1px))",
          }}
        />

        {/* Monogram in the center */}
        <div
          className="relative overflow-hidden rounded-full bg-white shadow-[0_4px_16px_rgba(11,61,145,0.18)]"
          style={{ width: s.logo, height: s.logo }}
        >
          <Image
            src="/logo/monogram-white-on-blue.jpeg"
            alt="Divine Love 26"
            fill
            sizes={`${s.logo}px`}
            className="object-cover"
            priority
          />
        </div>
      </div>

      {label ? (
        <p
          className={cn(
            "font-sans text-[11px] tracking-[0.35em] uppercase inline-flex items-baseline gap-0.5",
            onDark ? "text-white/60" : "text-warm-500",
          )}
        >
          <span>{label}</span>
          <span aria-hidden className="inline-flex gap-0.5 ml-1">
            <span className="animate-brand-dot [animation-delay:0ms]">.</span>
            <span className="animate-brand-dot [animation-delay:200ms]">.</span>
            <span className="animate-brand-dot [animation-delay:400ms]">.</span>
          </span>
        </p>
      ) : null}

      <style>{`
        @keyframes brand-spin {
          to { transform: rotate(360deg); }
        }
        .animate-brand-spin {
          animation: brand-spin 1.1s linear infinite;
        }
        @keyframes brand-dot {
          0%, 80%, 100% { opacity: 0.2; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-1px); }
        }
        .animate-brand-dot {
          animation: brand-dot 1.4s ease-in-out infinite both;
        }
      `}</style>
    </div>
  );
}
