"use client";

import { useRef } from "react";
import Image from "next/image";
import SplitReveal from "@/components/ui/SplitReveal";
import Marquee from "@/components/ui/Marquee";
import { COUPLE } from "@/lib/constants";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const BIG_TEXT = [
  COUPLE.partner1,
  COUPLE.partner2,
  "20 · 06 · 26",
];

export default function Footer() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to("[data-footer-monogram]", {
        rotate: 20,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.set("[data-footer-names] [data-char]", { y: "100%" });
      gsap.to("[data-footer-names] [data-char]", {
        y: 0,
        duration: 1.2,
        stagger: 0.02,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-footer-names]",
          start: "top 90%",
        },
      });
    },
    { scope },
  );

  void ScrollTrigger;

  return (
    <footer
      ref={scope}
      className="relative bg-gradient-to-b from-royal-dark to-[#041d4a] text-white/80 overflow-hidden noise-overlay"
    >
      {/* Oversize kinetic band */}
      <div className="relative border-y border-white/10 py-6 md:py-8 bg-black/10">
        <Marquee speed={55}>
          {BIG_TEXT.map((t, i) => (
            <span
              key={i}
              className="inline-flex items-center font-serif italic text-white/15 text-5xl md:text-7xl px-10"
            >
              {t}
              <span
                aria-hidden
                className="mx-10 inline-block h-2 w-2 rotate-45 bg-gold/50"
              />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,180,196,0.06)_0%,_transparent_60%)]" />

      <div className="relative z-[2] max-w-4xl mx-auto px-6 text-center py-24 md:py-28">
        <Image
          data-footer-monogram
          src="/logo/monogram-white-on-blue.jpeg"
          alt="DL Monogram"
          width={68}
          height={68}
          className="mx-auto rounded-full border border-white/10 mb-10 shadow-[0_0_40px_rgba(168,180,196,0.2)] will-change-transform"
        />

        <SplitReveal
          text={`${COUPLE.partner1} & ${COUPLE.partner2}`}
          as="h3"
          data-footer-names
          className="font-serif text-3xl md:text-5xl font-light text-white mb-4 tracking-wide"
        />

        <p className="font-serif text-sm md:text-base text-white/50 italic mb-2">
          20th June, 2026
        </p>

        <div className="flex items-center justify-center gap-3 my-10">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/30" />
          <span className="w-1.5 h-1.5 rotate-45 bg-gold/50" />
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/30" />
        </div>

        <p className="font-sans text-[10px] tracking-[0.45em] text-gold-light/50 uppercase">
          {COUPLE.hashtag}
        </p>

        <p className="font-sans text-xs text-white/25 mt-14">
          We can&apos;t wait to celebrate with you
        </p>
      </div>
    </footer>
  );
}
