"use client";

import { useRef } from "react";
import CountdownTimer from "@/components/ui/countdown-timer";
import SplitReveal from "@/components/ui/split-reveal";
import MagneticButton from "@/components/ui/magnetic-button";
import PaperCard from "@/components/props/paper-card";
import VideoFrame from "@/components/props/video-frame";
import WaxSeal from "@/components/props/wax-seal";
import FloralGarnish from "@/components/props/floral-garnish";
import { COUPLE } from "@/lib/constants";
import { LETTER_VIDEO } from "@/lib/scenes";
import { useGSAP, gsap } from "@/lib/gsap";

const RSVP_URL = process.env.NEXT_PUBLIC_RSVP_URL || "/rsvp";

/**
 * Scene 2 — The Letter.
 *
 * The Save-the-Date card that was sealed inside the envelope. This whole
 * scene fits within a single viewport — no window scroll. On desktop it's
 * a horizontal pair (video reel on the left, details on the right); on
 * mobile it stacks vertically but still fits within 100dvh.
 */
export default function LetterScene() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      gsap.set("[data-letter-eyebrow] [data-char]", { y: "100%" });
      gsap.set("[data-letter-partner] [data-char]", { y: "100%" });
      gsap.set("[data-letter-date] [data-char]", { y: "100%" });

      gsap.fromTo(
        "[data-letter-card]",
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.3,
          ease: "expo.out",
          delay: 0.25,
        },
      );

      const reveal = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: 0.55,
      });

      reveal
        .to("[data-letter-eyebrow] [data-char]", {
          y: 0,
          duration: 0.8,
          stagger: 0.015,
        })
        .to(
          "[data-letter-partner] [data-char]",
          { y: 0, duration: 1.1, stagger: 0.02 },
          "-=0.4",
        )
        .fromTo(
          "[data-letter-amp]",
          { opacity: 0, scaleX: 0 },
          { opacity: 1, scaleX: 1, duration: 0.9 },
          "-=0.6",
        )
        .to(
          "[data-letter-date] [data-char]",
          { y: 0, duration: 0.9, stagger: 0.025 },
          "-=0.4",
        )
        .fromTo(
          "[data-letter-countdown]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1 },
          "-=0.2",
        )
        .fromTo(
          "[data-letter-cta]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.6",
        );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="save-the-date"
      className="relative h-screen overflow-hidden flex items-center justify-center px-4 md:px-8 py-20 md:py-24"
    >
      {/* Royal backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-royal-dark via-[#081f47] to-[#050f2e]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,180,196,0.12)_0%,_transparent_65%)]" />

      <div
        data-letter-card
        className="relative z-[2] w-full max-w-5xl"
        style={{ willChange: "transform, opacity" }}
      >
        <PaperCard
          tone="night"
          bordered
          radius={4}
          className="relative px-5 py-6 md:px-10 md:py-10"
        >
          <FloralGarnish
            position="top-left"
            size="w-24 md:w-36"
            className="z-[3] -translate-x-[40%] -translate-y-[35%]"
          />
          <FloralGarnish
            position="bottom-right"
            size="w-24 md:w-36"
            className="z-[3] translate-x-[30%] translate-y-[30%]"
          />

          <div className="relative z-[2] grid md:grid-cols-[6fr_5fr] gap-6 md:gap-10 items-center">
            {/* Video reel */}
            <div
              className="relative mx-auto w-full max-w-[340px] md:max-w-none rounded-sm overflow-hidden ring-1 ring-gold/25 shadow-[0_18px_48px_-20px_rgba(0,0,0,0.6)]"
              style={{ aspectRatio: "4 / 5" }}
            >
              <VideoFrame
                src={LETTER_VIDEO}
                poster="/gallery/prewedding-12.jpg"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-dark/55 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-3 border border-gold/20 pointer-events-none" />
            </div>

            {/* Text column */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <SplitReveal
                text="Save · the · Date"
                as="p"
                data-letter-eyebrow
                className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-gold-light/85 mb-4"
              />

              <h2 className="font-serif text-white leading-[1.05]">
                <SplitReveal
                  text={COUPLE.partner1.split(" ")[0] ?? COUPLE.partner1}
                  as="span"
                  data-letter-partner
                  className="block text-3xl md:text-5xl font-light tracking-wide"
                />
                <span
                  data-letter-amp
                  className="inline-flex items-center gap-3 my-1.5 origin-center"
                >
                  <span className="h-px w-6 md:w-10 bg-gradient-to-r from-transparent to-gold/70" />
                  <span className="font-script text-gold text-2xl md:text-3xl leading-none">
                    &amp;
                  </span>
                  <span className="h-px w-6 md:w-10 bg-gradient-to-l from-transparent to-gold/70" />
                </span>
                <SplitReveal
                  text={COUPLE.partner2.split(" ")[0] ?? COUPLE.partner2}
                  as="span"
                  data-letter-partner
                  className="block text-3xl md:text-5xl font-light tracking-wide"
                />
              </h2>

              <div className="mt-4 flex items-center gap-3 text-white/80">
                <span className="h-px w-6 md:w-8 bg-white/30" />
                <SplitReveal
                  text="20 · 06 · 26"
                  as="p"
                  data-letter-date
                  className="font-serif italic tracking-[0.3em] text-sm md:text-lg"
                />
                <span className="h-px w-6 md:w-8 bg-white/30" />
              </div>

              <div className="mt-4 md:mt-5 flex items-center gap-3 opacity-90">
                <span className="h-px w-6 bg-gold/40" />
                <WaxSeal initials="DL" size={38} />
                <span className="h-px w-6 bg-gold/40" />
              </div>

              <div
                data-letter-countdown
                className="mt-5 md:mt-6 opacity-0 scale-[0.9] md:scale-100 origin-center md:origin-left"
              >
                <CountdownTimer />
              </div>

              <div data-letter-cta className="mt-6 md:mt-7 opacity-0">
                <MagneticButton
                  href={RSVP_URL}
                  strength={0.35}
                  className="group"
                >
                  <span className="relative inline-flex items-center gap-3 rounded-full border border-gold/50 bg-black/25 px-6 md:px-8 py-2.5 md:py-3 font-sans text-[11px] tracking-[0.35em] uppercase text-gold-light backdrop-blur-md transition-colors duration-500 hover:border-gold hover:text-white hover:bg-black/40">
                    <span className="h-px w-4 bg-gold-light/60 transition-all duration-500 group-hover:w-8 group-hover:bg-gold" />
                    Respond to the invitation
                  </span>
                </MagneticButton>
              </div>

              <p className="mt-4 md:mt-5 font-sans text-[9px] md:text-[10px] tracking-[0.45em] text-gold-light/55 uppercase">
                {COUPLE.hashtag}
              </p>
            </div>
          </div>
        </PaperCard>
      </div>
    </section>
  );
}
