"use client";

import Link from "next/link";
import type { Route } from "next";

interface SceneNextProps {
  href: Route;
  /** Short label shown after the arrow, e.g. "Our Story". */
  label: string;
  /** Small text above the arrow, e.g. "Continue". Defaults to "Continue". */
  hint?: string;
  /** Dark or light palette. Defaults to "dark" (for cream-on-dark scenes). */
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Next-step navigation button that sits at the bottom of each scene
 * page and advances the reader to the next section (Hero → Story →
 * Events → Gifts → Gallery). The whole thing is a Next `<Link>` so
 * prefetching happens automatically.
 */
export default function SceneNext({
  href,
  label,
  hint = "Continue",
  variant = "dark",
  className = "",
}: SceneNextProps) {
  const palette =
    variant === "light"
      ? "border-gold/60 bg-white/[0.06] text-gold-light hover:bg-white/[0.12] hover:border-gold hover:text-white"
      : "border-royal/30 bg-white text-royal-700 hover:border-royal hover:text-royal shadow-[0_10px_30px_rgba(11,61,145,0.1)] hover:shadow-[0_16px_44px_rgba(11,61,145,0.2)]";

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <span
        className={`font-sans text-[10px] tracking-[0.45em] uppercase ${
          variant === "light" ? "text-gold-light/65" : "text-gold-dark/70"
        }`}
      >
        {hint}
      </span>

      <Link
        href={href}
        className={`group inline-flex items-center gap-4 rounded-full border px-8 py-3.5 font-sans text-[11px] tracking-[0.35em] uppercase backdrop-blur-md transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${palette}`}
      >
        <span
          className={`h-px w-5 transition-all duration-500 group-hover:w-10 ${
            variant === "light" ? "bg-gold-light/60 group-hover:bg-gold" : "bg-royal/50 group-hover:bg-gold"
          }`}
        />
        {label}
        <span
          aria-hidden
          className="inline-flex items-center justify-center h-7 w-7 rounded-full transition-transform duration-500 group-hover:translate-x-1"
          style={{
            background:
              variant === "light" ? "rgba(201,168,76,0.2)" : "rgba(11,61,145,0.08)",
            color: variant === "light" ? "#c5cdd8" : "#0b3d91",
          }}
        >
          &rarr;
        </span>
      </Link>
    </div>
  );
}
