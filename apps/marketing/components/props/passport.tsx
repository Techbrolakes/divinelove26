"use client";

import { type MouseEvent } from "react";

interface PassportProps {
  label: string;
  subtitle?: string;
  href?: string;
  width?: number;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
  className?: string;
}

/**
 * Stationery "passport" prop — dark royal-blue cover with gold globe and
 * embossed label. Used on the desk scene as a jump-point into Events.
 */
export default function Passport({
  label,
  subtitle,
  href,
  width = 220,
  onClick,
  className = "",
}: PassportProps) {
  const content = (
    <div
      className={`relative overflow-hidden rounded-[6px] envelope-paper text-gold-light shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:-rotate-2 group-hover:-translate-y-1 ${className}`}
      style={{ width, aspectRatio: 0.72 }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.3\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative h-full flex flex-col items-center justify-between py-8 px-6 text-center">
        <p className="font-sans text-[9px] tracking-[0.45em] uppercase text-gold/80">
          {subtitle ?? "Celebration · 2026"}
        </p>

        {/* Gold embossed globe */}
        <svg
          viewBox="0 0 120 120"
          className="w-24 h-24 md:w-28 md:h-28"
          aria-hidden
        >
          <defs>
            <radialGradient id="globe-grad" cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#e8d8a8" />
              <stop offset="100%" stopColor="#a8875a" />
            </radialGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="url(#globe-grad)"
            strokeWidth="1.5"
          />
          <ellipse
            cx="60"
            cy="60"
            rx="48"
            ry="16"
            fill="none"
            stroke="url(#globe-grad)"
            strokeWidth="1"
          />
          <ellipse
            cx="60"
            cy="60"
            rx="24"
            ry="48"
            fill="none"
            stroke="url(#globe-grad)"
            strokeWidth="1"
          />
          <line
            x1="12"
            y1="60"
            x2="108"
            y2="60"
            stroke="url(#globe-grad)"
            strokeWidth="1"
          />
          <line
            x1="60"
            y1="12"
            x2="60"
            y2="108"
            stroke="url(#globe-grad)"
            strokeWidth="1"
          />
        </svg>

        <div>
          <p className="font-serif text-lg md:text-xl text-gold-light tracking-[0.12em] uppercase">
            {label}
          </p>
          <div className="mt-2 inline-flex items-center gap-2">
            <span className="h-px w-6 bg-gold/60" />
            <span className="w-1 h-1 rotate-45 bg-gold/70" />
            <span className="h-px w-6 bg-gold/60" />
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className="group inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-[6px]"
      >
        {content}
      </a>
    );
  }
  return (
    <div
      onClick={onClick}
      className="group inline-block cursor-pointer"
    >
      {content}
    </div>
  );
}
