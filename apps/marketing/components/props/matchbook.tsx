"use client";

import { type MouseEvent } from "react";

interface MatchbookProps {
  label: string;
  href?: string;
  width?: number;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
}

/**
 * Matchbook prop — cream cover with double-ruled border and a red match head
 * peeking from the top on hover. Links/scrolls to its target scene.
 */
export default function Matchbook({
  label,
  href,
  width = 140,
  className = "",
  onClick,
}: MatchbookProps) {
  const content = (
    <div
      className={`group/matchbook relative ${className}`}
      style={{ width, aspectRatio: 0.78 }}
    >
      {/* Peek-out matches behind cover */}
      <div
        aria-hidden
        className="absolute left-1/2 -top-6 -translate-x-1/2 flex gap-[3px] transition-transform duration-500 ease-out group-hover/matchbook:-translate-y-1"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#b8382c] shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
            <div className="w-[3px] h-8 bg-[#f4ead2]" />
          </div>
        ))}
      </div>

      {/* Cover */}
      <div className="relative h-full w-full rounded-[3px] bg-[#fbf3e0] shadow-[0_18px_48px_-16px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.22] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.6\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: "160px 160px",
          }}
        />
        <div className="absolute inset-2 border border-ink/15 rounded-[2px]" />
        <div className="absolute inset-[7px] border border-ink/10 rounded-[2px]" />

        <div className="relative h-full flex items-center justify-center">
          <p className="font-serif text-ink/80 text-2xl tracking-[0.1em]">
            {label}
          </p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-[3px]"
      >
        {content}
      </a>
    );
  }
  return (
    <div onClick={onClick} className="inline-block cursor-pointer">
      {content}
    </div>
  );
}
