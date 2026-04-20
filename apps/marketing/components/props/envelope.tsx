"use client";

import { forwardRef, type ReactNode } from "react";
import WaxSeal from "./wax-seal";

type EnvelopeState = "sealed" | "opening" | "open";

interface EnvelopeProps {
  state?: EnvelopeState;
  className?: string;
  /** Contents rendered inside the envelope window (e.g. a Save-the-Date card). */
  children?: ReactNode;
  /** Monogram letters on the wax seal. */
  initials?: string;
  /** Aspect ratio (width/height). Default 1.6 → landscape envelope. */
  aspect?: number;
}

/**
 * Royal-blue envelope built from layered CSS/SVG. Three animated layers:
 *   - body (paper back)
 *   - flap (triangular upper, rotates open)
 *   - wax seal (fractures on open)
 *
 * The parent controls lift/sink/opacity via CSS on `data-envelope-*`
 * selectors exposed inside. GSAP drives the flap via
 * `data-envelope-flap { rotateX }` so the paper opens cleanly upward.
 */
const Envelope = forwardRef<HTMLDivElement, EnvelopeProps>(function Envelope(
  { state = "sealed", className = "", children, initials = "DL", aspect = 1.6 },
  ref,
) {
  return (
    <div
      ref={ref}
      data-envelope-root
      data-state={state}
      className={`relative ${className}`}
      style={{ aspectRatio: String(aspect) }}
    >
      {/* Drop shadow */}
      <div
        aria-hidden
        className="absolute -inset-x-4 -bottom-6 h-8 rounded-full bg-black/55 blur-2xl opacity-80"
      />

      {/* Back of envelope (paper body) */}
      <div
        data-envelope-body
        className="absolute inset-0 envelope-paper rounded-sm shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]"
      >
        {/* Subtle paper fibre noise overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.2\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
            backgroundSize: "220px 220px",
          }}
        />
        {/* Inner gold hairline border */}
        <div className="absolute inset-2 border border-gold/25 rounded-sm pointer-events-none" />
        {/* Inner window — anything placed in children shows here */}
        <div className="absolute inset-4 overflow-hidden">{children}</div>

        {/* Lower inverted-V fold lines (subtle) */}
        <svg
          viewBox="0 0 160 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
        >
          <path
            d="M0 35 L80 85 L160 35"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.3"
            fill="none"
          />
        </svg>
      </div>

      {/* Top flap — rotates to open. transform-origin: top. */}
      <div
        data-envelope-flap
        className="absolute inset-x-0 top-0 h-[62%] origin-top will-change-transform pointer-events-none"
        style={{ perspective: "1200px" }}
      >
        <svg
          viewBox="0 0 160 100"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="flap-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1d3d76" />
              <stop offset="60%" stopColor="#0f2a5b" />
              <stop offset="100%" stopColor="#081f47" />
            </linearGradient>
          </defs>
          <path
            d="M0 0 L160 0 L80 85 Z"
            fill="url(#flap-grad)"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="0.3"
          />
          {/* inner crease highlight */}
          <path
            d="M0 0 L80 82 L160 0"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.3"
            fill="none"
          />
        </svg>
      </div>

      {/* Wax seal — sits at the flap tip, positioned center-x */}
      <div
        data-envelope-seal
        className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          width: `min(22%, 140px)`,
        }}
      >
        <WaxSeal initials={initials} size={140} className="w-full h-auto" />
      </div>
    </div>
  );
});

export default Envelope;
