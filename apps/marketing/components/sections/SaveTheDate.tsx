"use client";

import { useRef } from "react";
import Image from "next/image";
import Marquee from "@/components/ui/Marquee";
import SplitReveal from "@/components/ui/SplitReveal";
import Ornament from "@/components/ui/Ornament";
import { SAVE_THE_DATE_BACKDROP } from "@/lib/constants";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const MARQUEE_ITEMS = [
  "You are invited",
  "20 · 06 · 26",
  "Divine Love",
  "A Royal Celebration",
  "#DIVINELOVE26",
];

const FEATURED_PHOTO = "/gallery/prewedding-09.jpg";

export default function SaveTheDate() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      gsap.set("[data-std-title] [data-char]", { y: "100%" });
      gsap.set("[data-std-label] [data-char]", { y: "100%" });

      gsap.to("[data-std-label] [data-char]", {
        y: 0,
        duration: 0.8,
        stagger: 0.012,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-std-label]",
          start: "top 85%",
        },
      });

      gsap.to("[data-std-title] [data-char]", {
        y: 0,
        duration: 1.1,
        stagger: 0.025,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-std-title]",
          start: "top 85%",
        },
      });

      // Featured photo — clip reveal with parallax
      gsap.fromTo(
        "[data-std-photo]",
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.7,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-std-photo]",
            start: "top 85%",
          },
        },
      );

      gsap.to("[data-std-photo-img]", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-std-photo]",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        "[data-std-photo-tag]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay: 0.4,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-std-photo]",
            start: "top 85%",
          },
        },
      );

      // Wax seal card reveal
      gsap.fromTo(
        "[data-std-card]",
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-std-card]",
            start: "top 80%",
          },
        },
      );

      // Seal spinner
      gsap.to("[data-std-seal]", {
        rotate: 360,
        duration: 36,
        ease: "none",
        repeat: -1,
      });

      // Date stamp kinetic enter
      gsap.fromTo(
        "[data-std-date-big]",
        { opacity: 0, y: 40, letterSpacing: "0.05em" },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.35em",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-std-date-big]",
            start: "top 85%",
          },
        },
      );

      // Slow ken burns on backdrop photo
      gsap.fromTo(
        "[data-std-backdrop]",
        { scale: 1.1, yPercent: -2 },
        {
          scale: 1.22,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        },
      );

      // Ornament draw-in
      gsap.utils.toArray<SVGPathElement>("[data-std-ornament] path").forEach((p) => {
        const length = (() => {
          try {
            return p.getTotalLength();
          } catch {
            return 200;
          }
        })();
        gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-std-ornament]",
            start: "top 85%",
          },
        });
      });
    },
    { scope },
  );

  void ScrollTrigger;

  return (
    <section
      ref={scope}
      className="relative overflow-hidden"
    >
      {/* Photo backdrop — heavily toned */}
      <div
        data-std-backdrop
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={SAVE_THE_DATE_BACKDROP}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          quality={85}
          aria-hidden="true"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1428]/94 via-[#11162a]/92 to-[#0a1428]/97" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,_rgba(201,168,76,0.14)_0%,_transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23c9a84c' stroke-width='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top marquee flowing across section boundary */}
      <div className="relative border-y border-white/10 bg-black/25 backdrop-blur-sm py-5 md:py-6">
        <Marquee speed={38} scrollDriven>
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center font-serif italic text-gold-light/70 text-2xl md:text-4xl px-8"
            >
              {item}
              <span
                aria-hidden
                className="mx-8 inline-block h-1.5 w-1.5 rotate-45 bg-gold/60"
              />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="relative z-[2] px-6 py-24 md:py-36 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-[1.15fr_1fr] gap-12 md:gap-20 items-center">
          {/* Left — featured couple photo with layered typography */}
          <div className="relative">
            <div
              data-std-photo
              className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)]"
              style={{ willChange: "clip-path, transform" }}
            >
              <div
                data-std-photo-img
                className="absolute -inset-y-8 inset-x-0 will-change-transform"
              >
                <Image
                  src={FEATURED_PHOTO}
                  alt="Divine and Love — featured portrait"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 55vw"
                  quality={90}
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-royal-dark/45 via-transparent to-transparent" />
              <div className="absolute inset-4 border border-gold/25 pointer-events-none" />
              <div className="absolute inset-6 border border-gold/10 pointer-events-none" />

              {/* Floating tag */}
              <span
                data-std-photo-tag
                className="absolute top-6 left-6 inline-flex items-center gap-3 font-sans text-[9px] tracking-[0.45em] uppercase text-gold-light backdrop-blur-md bg-black/30 border border-gold/30 rounded-full px-4 py-2"
              >
                <span className="w-1 h-1 rounded-full bg-gold" />
                Est. 2020
              </span>

              {/* Caption lock-up at bottom */}
              <div
                data-std-photo-tag
                className="absolute left-6 right-6 bottom-6 flex items-end justify-between gap-4"
              >
                <p className="font-serif italic text-gold-light/90 text-lg md:text-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                  Divine &amp; Love
                </p>
                <span className="font-sans text-[9px] tracking-[0.45em] uppercase text-gold-light/60">
                  No. 01
                </span>
              </div>
            </div>

            {/* Date stamp overlap bottom-right */}
            <div
              data-std-date-big
              className="absolute -right-4 md:-right-8 -bottom-8 md:-bottom-12 bg-[#0a1428] border border-gold/35 rounded-full px-6 md:px-10 py-4 md:py-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] opacity-0"
              style={{ willChange: "transform, opacity" }}
            >
              <p className="font-sans text-[9px] tracking-[0.5em] uppercase text-gold-light/60">
                The Date
              </p>
              <p className="font-serif text-2xl md:text-4xl text-gold-light italic tabular-nums mt-1 leading-none">
                20 · 06 · 26
              </p>
            </div>
          </div>

          {/* Right — editorial text + wax seal card stacked */}
          <div className="relative">
            <SplitReveal
              text="The honour of your presence"
              as="p"
              data-std-label
              className="font-sans text-[10px] tracking-[0.55em] uppercase text-gold-light/70 mb-5"
            />
            <SplitReveal
              text="You are invited"
              as="h2"
              data-std-title
              className="font-serif text-5xl md:text-7xl font-light text-white tracking-[0.01em] leading-[0.95]"
            />

            <div data-std-ornament className="mt-8 text-gold">
              <Ornament variant="diamond" className="w-44" />
            </div>

            <p className="mt-8 max-w-md font-sans text-[13px] md:text-[14px] text-white/70 leading-[1.95]">
              Requested at the marriage of{" "}
              <span className="italic text-gold-light">Divine</span> and{" "}
              <span className="italic text-gold-light">Love</span> — a day
              stitched together from years of quiet devotion, and set to the
              rhythm of everyone we hold dear.
            </p>

            {/* Wax seal card — smaller, integrated */}
            <div className="mt-10 relative flex items-center gap-6 max-w-md">
              <div
                data-std-card
                className="relative w-32 md:w-40 shrink-0 rounded-[4px] overflow-hidden shadow-[0_30px_80px_-20px_rgba(11,61,145,0.45)]"
              >
                <Image
                  src="/logo/save-the-date-wax-seal.jpeg"
                  alt="Save the Date — wax seal"
                  width={400}
                  height={520}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-px w-8 bg-gold/50" />
                  <span className="font-sans text-[9px] tracking-[0.45em] uppercase text-gold-light/70">
                    Sealed with love
                  </span>
                </div>
                <p className="font-serif italic text-white/80 text-sm md:text-base leading-[1.65]">
                  Kindly hold the date &mdash; a full invitation will follow in
                  the weeks ahead.
                </p>
              </div>
            </div>

            {/* Seal badge — now anchored to lower-right of content column */}
            <div className="mt-10 flex items-center justify-between gap-6 border-t border-white/10 pt-6">
              <div className="flex items-center gap-4 text-[10px] tracking-[0.45em] uppercase text-white/45">
                <span className="h-px w-10 bg-white/20" />
                <span className="text-gold-light">Formal · Attire</span>
              </div>

              <div
                data-std-seal
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-royal-dark flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.35)] border border-gold/30"
                style={{ willChange: "transform" }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full absolute">
                  <defs>
                    <path
                      id="std-circle"
                      d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                      fill="none"
                    />
                  </defs>
                  <text className="fill-gold-light font-sans text-[9px] tracking-[0.35em] uppercase">
                    <textPath href="#std-circle" startOffset="0">
                      Divine · Love · 26 ·
                    </textPath>
                  </text>
                </svg>
                <span className="font-serif text-gold-light text-lg md:text-xl italic">
                  &amp;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
