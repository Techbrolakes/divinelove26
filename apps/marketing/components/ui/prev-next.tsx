"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useGSAP, gsap } from "@/lib/gsap";

interface PrevNextProps {
  prev?: { href: Route; label: string };
  next?: { href: Route; label: string };
  step?: number;
  total?: number;
  /** Inline at end of a scrollable container instead of viewport-fixed. */
  inline?: boolean;
}

/**
 * Prev/Next scene navigation. On mobile it collapses to compact
 * icon-only circles so it takes minimal vertical real-estate and never
 * overlaps content. On desktop it expands to pill buttons with labels.
 */
export default function PrevNext({
  prev,
  next,
  step,
  total,
  inline = false,
}: PrevNextProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Continuous nudge on the next-arrow so users see where to go.
      gsap.to("[data-pn-next-arrow]", {
        x: 4,
        repeat: -1,
        yoyo: true,
        duration: 0.9,
        ease: "sine.inOut",
      });

      gsap.fromTo(
        "[data-pn-btn]",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "expo.out",
          stagger: 0.08,
          delay: 0.4,
        },
      );
      gsap.fromTo(
        "[data-pn-step]",
        { opacity: 0 },
        { opacity: 1, duration: 0.7, delay: 0.8 },
      );
    },
    { scope: root },
  );

  return (
    <nav
      ref={root}
      aria-label="Scene navigation"
      className={
        inline
          ? "relative z-[2] mt-12 md:mt-16 flex items-center justify-center gap-3 md:gap-5"
          : "fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 md:gap-5"
      }
    >
      {prev ? (
        <Link
          href={prev.href}
          data-pn-btn
          aria-label={`Previous: ${prev.label}`}
          className="group inline-flex items-center gap-2 md:gap-3 rounded-full border border-gold/45 bg-royal-dark/75 backdrop-blur-md h-10 w-10 md:h-auto md:w-auto md:pl-3 md:pr-5 md:py-2 justify-center text-gold-light transition-all duration-500 hover:border-gold hover:text-white hover:bg-royal-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        >
          <span className="md:inline-flex md:h-9 md:w-9 md:items-center md:justify-center md:rounded-full md:border md:border-gold/50 md:bg-black/35 transition-all duration-500 group-hover:md:border-gold group-hover:md:-translate-x-0.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </span>
          <span className="hidden md:inline font-sans text-[11px] tracking-[0.35em] uppercase">
            {prev.label}
          </span>
        </Link>
      ) : (
        <span className="w-10 md:w-20" aria-hidden />
      )}

      {typeof step === "number" && typeof total === "number" && (
        <span
          data-pn-step
          className="font-serif italic text-gold-light/80 text-xs md:text-sm tabular-nums tracking-[0.15em]"
        >
          {String(step).padStart(2, "0")}
          <span className="text-gold/40 mx-1">/</span>
          <span className="text-gold-light/55">
            {String(total).padStart(2, "0")}
          </span>
        </span>
      )}

      {next ? (
        <Link
          href={next.href}
          data-pn-btn
          aria-label={`Next: ${next.label}`}
          className="group inline-flex items-center gap-2 md:gap-3 rounded-full border border-gold/70 bg-gold/15 backdrop-blur-md h-10 w-10 md:h-auto md:w-auto md:pl-5 md:pr-3 md:py-2 justify-center text-gold-light transition-all duration-500 hover:border-gold hover:text-white hover:bg-gold/25 hover:shadow-[0_14px_38px_-10px_rgba(201,168,76,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        >
          <span className="hidden md:inline font-sans text-[11px] tracking-[0.35em] uppercase">
            {next.label}
          </span>
          <span className="md:inline-flex md:h-9 md:w-9 md:items-center md:justify-center md:rounded-full md:bg-gold/80 md:text-royal-dark transition-colors duration-500 group-hover:md:bg-gold">
            <svg
              data-pn-next-arrow
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      ) : (
        <span className="w-10 md:w-20" aria-hidden />
      )}
    </nav>
  );
}
