"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getLenisInstance } from "@/lib/lenis-instance";

const SHOW_AFTER_PX = 520;
const RING_RADIUS = 22;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const max =
        (document.documentElement.scrollHeight || 0) - window.innerHeight;
      const pct = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
      setVisible(y > SHOW_AFTER_PX);
      setProgress(pct);
    };

    // Live per-frame updates — Lenis fires on every animation frame it ticks
    const lenis = getLenisInstance();
    const onLenisScroll = (data: { scroll: number; limit: number }) => {
      const { scroll, limit } = data;
      const pct = limit > 0 ? Math.min(Math.max(scroll / limit, 0), 1) : 0;
      setVisible(scroll > SHOW_AFTER_PX);
      setProgress(pct);
    };

    if (lenis) {
      lenis.on("scroll", onLenisScroll);
      // Prime with current state
      compute();
    } else {
      // Fallback — rAF loop piggybacking on window.scrollY to stay live during momentum
      const loop = () => {
        compute();
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", compute);
    return () => {
      if (lenis) lenis.off("scroll", onLenisScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const handleClick = useCallback(() => {
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`group fixed right-5 bottom-5 md:right-8 md:bottom-8 z-50 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border border-gold/40 bg-royal-dark/85 backdrop-blur-md text-gold-light shadow-[0_14px_36px_rgba(0,0,0,0.35)] transition-[opacity,transform,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:border-gold hover:bg-royal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Progress ring */}
      <svg
        viewBox="0 0 52 52"
        className="absolute inset-0 h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="26"
          cy="26"
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(201,168,76,0.18)"
          strokeWidth="1.5"
        />
        <circle
          cx="26"
          cy="26"
          r={RING_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
        />
      </svg>

      {/* Up-arrow + thin baseline */}
      <span className="relative flex flex-col items-center gap-1">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5"
          aria-hidden
        >
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </span>
    </button>
  );
}
