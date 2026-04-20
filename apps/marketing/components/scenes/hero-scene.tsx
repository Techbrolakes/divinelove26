"use client";

import { useRef } from "react";
import Image from "next/image";
import CountdownTimer from "@/components/ui/countdown-timer";
import { COUPLE } from "@/lib/constants";
import { useGSAP, gsap } from "@/lib/gsap";

/**
 * Hero — the landing. The names are the star, housed in a deep navy
 * card with a platinum hairline border so they pop off the shared blue
 * video backdrop. All accents use the brand silver-platinum tone (the
 * `gold` token) rather than a warm yellow gold.
 */
export default function HeroScene() {
  const scope = useRef<HTMLElement>(null);

  // First names front-and-centre, surnames quiet below.
  const first1 = COUPLE.partner1.split(" ")[0] ?? COUPLE.partner1;
  const first2 = COUPLE.partner2.split(" ")[0] ?? COUPLE.partner2;
  const last1 = COUPLE.partner1.split(" ").slice(1).join(" ");
  const last2 = COUPLE.partner2.split(" ").slice(1).join(" ");

  useGSAP(
    () => {
      // One quick fade-up for everything — no dramatic stagger.
      gsap.fromTo(
        "[data-hero-reveal]",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.1,
        },
      );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative z-[1] h-screen overflow-hidden flex flex-col items-center justify-center text-center px-5 pt-20 pb-24"
    >
      <div data-hero-reveal className="opacity-0 flex flex-col items-center w-full">
        {/* Eyebrow with platinum rules */}
        <div className="flex items-center gap-3 mb-5 md:mb-7">
          <span className="h-px w-10 md:w-14 bg-gradient-to-r from-transparent to-gold/70" />
          <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.55em] text-gold-light/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Save · the · Date
          </p>
          <span className="h-px w-10 md:w-14 bg-gradient-to-l from-transparent to-gold/70" />
        </div>

        {/* Monogram seal */}
        <div className="relative mb-4 md:mb-5">
          <Image
            src="/logo/monogram-white-on-blue.jpeg"
            alt="Divine Love Monogram"
            width={240}
            height={240}
            className="relative w-[88px] h-[88px] md:w-[104px] md:h-[104px] rounded-full object-cover ring-1 ring-gold/50 shadow-[0_0_60px_rgba(168,180,196,0.35),0_20px_60px_rgba(0,0,0,0.55)]"
            priority
          />
        </div>

        {/* Names card */}
        <div
          className="relative w-full max-w-2xl rounded-sm border border-gold/40 px-5 md:px-8 py-5 md:py-6 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)]"
          style={{
            background:
              "linear-gradient(160deg, #0a2255 0%, #061a43 55%, #04123a 100%)",
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-2 border border-gold/20 rounded-[1px]"
          />

          <h1 className="relative font-serif text-white leading-[0.95] text-center">
            <span className="block text-4xl md:text-5xl lg:text-6xl font-light italic tracking-wide drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)]">
              {first1}
            </span>
            {last1 && (
              <span className="block mt-1.5 font-sans text-[9px] md:text-[10px] tracking-[0.55em] uppercase text-gold-light/75">
                {last1}
              </span>
            )}

            <span className="block my-3 md:my-4 origin-center">
              <span className="inline-flex items-center gap-4 md:gap-5">
                <span className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-gold/70" />
                <span className="font-script text-gold-light text-3xl md:text-4xl leading-none">
                  and
                </span>
                <span className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-gold/70" />
              </span>
            </span>

            <span className="block text-4xl md:text-5xl lg:text-6xl font-light italic tracking-wide drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)]">
              {first2}
            </span>
            {last2 && (
              <span className="block mt-1.5 font-sans text-[9px] md:text-[10px] tracking-[0.55em] uppercase text-gold-light/75">
                {last2}
              </span>
            )}
          </h1>

          <div className="relative mt-5 md:mt-6 flex items-center justify-center gap-3 text-white/80">
            <span className="h-px w-10 bg-white/25" />
            <p className="font-serif italic tracking-[0.3em] text-sm md:text-base">
              20 · 06 · 26
            </p>
            <span className="h-px w-10 bg-white/25" />
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-6 md:mt-7">
          <CountdownTimer />
        </div>

        {/* Hashtag */}
        <p className="mt-5 md:mt-6 font-sans text-[10px] tracking-[0.45em] text-gold-light/65 uppercase">
          {COUPLE.hashtag}
        </p>
      </div>
    </section>
  );
}
