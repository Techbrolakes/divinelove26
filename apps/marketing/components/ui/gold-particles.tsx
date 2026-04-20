"use client";

import { useMemo } from "react";

interface GoldParticlesProps {
  /** How many dust specks to render. */
  count?: number;
  className?: string;
}

/**
 * Ambient gold particles drifting slowly upward through the backdrop.
 * Positions + durations are seeded deterministically so server and
 * client render identical DOM and no hydration mismatch occurs.
 */
export default function GoldParticles({
  count = 24,
  className = "",
}: GoldParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // deterministic pseudo-random based on index
      const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453);
      const r2 = Math.abs(Math.sin(i * 78.233) * 43758.5453);
      const r3 = Math.abs(Math.sin(i * 39.425) * 43758.5453);
      const left = Math.round((r1 - Math.floor(r1)) * 10000) / 100; // %
      const size = 1 + Math.round((r2 - Math.floor(r2)) * 300) / 100; // 1..4 px
      const duration = 18 + Math.round((r3 - Math.floor(r3)) * 2400) / 100; // 18..42 s
      const delay = -Math.round((r2 - Math.floor(r2)) * 3000) / 100; // negative so they start mid-animation
      const opacity = 0.25 + (r3 - Math.floor(r3)) * 0.55;
      return { left, size, duration, delay, opacity, i };
    });
  }, [count]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <span
          key={p.i}
          className="gold-particle absolute rounded-full bg-gold"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: "0 0 6px rgba(201,168,76,0.6)",
          }}
        />
      ))}
    </div>
  );
}
