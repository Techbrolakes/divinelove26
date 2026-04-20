"use client";

import { useRef } from "react";
import SplitReveal from "@/components/ui/split-reveal";
import Ornament from "@/components/ui/ornament";
import FloralGarnish from "@/components/props/floral-garnish";
import { useGSAP, gsap } from "@/lib/gsap";

interface ComingSoonProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

/**
 * A viewport-sized holding card for pages that are being reimagined in
 * Phase 2 (Gallery, Events, Gifts). Keeps the stationery language alive —
 * parchment, floral accents, script title — without needing the full
 * scene content yet.
 */
export default function ComingSoonScene({
  eyebrow,
  title,
  subtitle,
}: ComingSoonProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.set("[data-cs-eyebrow] [data-char]", { y: "100%" });
      gsap.set("[data-cs-subtitle] [data-char]", { y: "100%" });

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: 0.3,
      });

      tl.to("[data-cs-eyebrow] [data-char]", {
        y: 0,
        duration: 0.8,
        stagger: 0.015,
      })
        .fromTo(
          "[data-cs-title]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.2 },
          "-=0.3",
        )
        .fromTo(
          "[data-cs-ornament]",
          { opacity: 0, scaleX: 0 },
          { opacity: 1, scaleX: 1, duration: 1 },
          "-=0.4",
        )
        .to(
          "[data-cs-subtitle] [data-char]",
          { y: 0, duration: 0.8, stagger: 0.01 },
          "-=0.5",
        )
        .fromTo(
          "[data-cs-floral]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15 },
          "-=0.6",
        );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative h-screen overflow-hidden flex items-center justify-center px-6 parchment"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.0\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: "320px 320px",
        }}
      />

      <div data-cs-floral className="opacity-0">
        <FloralGarnish
          position="top-left"
          size="w-32 md:w-48"
          className="z-[2]"
        />
      </div>
      <div data-cs-floral className="opacity-0">
        <FloralGarnish
          position="bottom-right"
          size="w-32 md:w-48"
          className="z-[2]"
        />
      </div>

      <div className="relative z-[3] text-center max-w-2xl">
        <SplitReveal
          text={eyebrow}
          as="p"
          data-cs-eyebrow
          className="font-sans text-[10px] md:text-xs tracking-[0.55em] uppercase text-ink/60 mb-6"
        />
        <h1
          data-cs-title
          className="font-script text-ink text-7xl md:text-9xl leading-[0.85] opacity-0"
        >
          {title}
        </h1>
        <div data-cs-ornament className="my-8 flex justify-center text-gold-dark/70 opacity-0">
          <Ornament variant="diamond" className="w-40" />
        </div>
        <SplitReveal
          text={subtitle}
          as="p"
          data-cs-subtitle
          className="font-serif italic text-ink/70 text-lg md:text-xl max-w-lg mx-auto leading-[1.55]"
        />
      </div>
    </section>
  );
}
