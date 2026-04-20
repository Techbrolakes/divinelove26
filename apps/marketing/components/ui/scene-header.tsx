"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";

interface SceneHeaderProps {
  eyebrow: string;
  title: string;
  /** Optional short subtitle in serif italic. */
  subtitle?: string;
  /** Unique id kept only for API compatibility; no longer used internally. */
  id?: string;
  className?: string;
}

/**
 * Editorial section header — a small uppercase eyebrow flanked by gold
 * hairlines, an italic serif title, and a diamond-punctuated rule.
 * Animation is a calm single fade-up.
 */
export default function SceneHeader({
  eyebrow,
  title,
  subtitle,
  className = "",
}: SceneHeaderProps) {
  const root = useRef<HTMLElement>(null);
  const reveal = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!reveal.current) return;
      gsap.fromTo(
        reveal.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.05 },
      );
    },
    { scope: root },
  );

  return (
    <header
      ref={root}
      className={`text-center max-w-2xl mx-auto ${className}`}
    >
      <div
        ref={reveal}
        className="opacity-0"
        style={{ willChange: "transform, opacity" }}
      >
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-10 md:w-14 bg-gradient-to-r from-transparent to-gold/70" />
          <p className="font-sans text-[10px] tracking-[0.55em] uppercase text-gold-light/85">
            {eyebrow}
          </p>
          <span className="h-px w-10 md:w-14 bg-gradient-to-l from-transparent to-gold/70" />
        </div>

        <h2 className="mt-5 md:mt-6 font-serif italic font-light text-white text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[0.01em] drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)]">
          {title}
        </h2>

        <div className="mt-5 md:mt-6 flex items-center justify-center gap-3 text-gold-light/75">
          <span className="h-px w-10 md:w-14 bg-gradient-to-r from-transparent to-gold/60" />
          <span className="inline-block w-1.5 h-1.5 rotate-45 bg-gold/80" />
          <span className="h-px w-10 md:w-14 bg-gradient-to-l from-transparent to-gold/60" />
        </div>

        {subtitle && (
          <p className="mt-5 font-serif italic text-gold-light/85 text-base md:text-lg leading-[1.55]">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
