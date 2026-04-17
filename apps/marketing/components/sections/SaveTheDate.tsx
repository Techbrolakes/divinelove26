"use client";

import { useRef } from "react";
import Image from "next/image";
import Marquee from "@/components/ui/Marquee";
import SplitReveal from "@/components/ui/SplitReveal";
import Ornament from "@/components/ui/Ornament";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const MARQUEE_ITEMS = [
  "Save the Date",
  "20 · 06 · 26",
  "Divine Love",
  "A Royal Celebration",
  "#DIVINELOVE26",
];

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

      // Card reveal with clip-path wipe + subtle 3D tilt on scroll
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

      gsap.to("[data-std-card-inner]", {
        rotateX: -6,
        rotateY: 4,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

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
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1428] via-[#11162a] to-[#0a1428]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,_rgba(201,168,76,0.10)_0%,_transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23c9a84c' stroke-width='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top marquee flowing across section boundary */}
      <div className="relative border-y border-white/10 bg-black/20 backdrop-blur-sm py-5 md:py-6">
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

      <div className="relative z-[2] px-6 py-24 md:py-36 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[1fr_1.1fr] gap-12 md:gap-16 items-center">
          {/* Left — editorial text */}
          <div>
            <SplitReveal
              text="An invitation"
              as="p"
              data-std-label
              className="font-sans text-[10px] tracking-[0.55em] uppercase text-gold-light/70 mb-4"
            />
            <SplitReveal
              text="Save · the · Date"
              as="h2"
              data-std-title
              className="font-serif text-5xl md:text-7xl font-light text-white tracking-[0.01em] leading-[0.95]"
            />

            <div
              data-std-ornament
              className="mt-8 text-gold"
            >
              <Ornament variant="diamond" className="w-44" />
            </div>

            <p
              data-std-date-big
              className="mt-10 font-serif text-3xl md:text-5xl text-gold-light italic tabular-nums opacity-0"
              style={{ willChange: "transform, opacity" }}
            >
              20 · 06 · 26
            </p>

            <p className="mt-6 max-w-md font-sans text-[13px] md:text-[14px] text-white/65 leading-[1.95]">
              The honour of your presence is requested at the marriage of{" "}
              <span className="italic text-gold-light">Divine</span> and{" "}
              <span className="italic text-gold-light">Love</span> — a day
              stitched together from years of quiet devotion, and set to the
              rhythm of everyone we hold dear.
            </p>

            <div className="mt-10 flex items-center gap-6 text-[10px] tracking-[0.45em] uppercase text-white/40">
              <span className="h-px w-12 bg-white/20" />
              <span className="text-gold-light">Formal · Attire</span>
              <span className="h-px w-12 bg-white/20" />
            </div>
          </div>

          {/* Right — the wax-seal card */}
          <div className="relative">
            <div
              data-std-card
              className="relative rounded-[6px] overflow-hidden shadow-[0_40px_120px_-20px_rgba(11,61,145,0.35)]"
              style={{ perspective: "1200px" }}
            >
              <div
                data-std-card-inner
                className="relative will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Image
                  src="/logo/save-the-date-wax-seal.jpeg"
                  alt="Save the Date — wax seal"
                  width={900}
                  height={1200}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>

            {/* Floating seal badge */}
            <div
              data-std-seal
              className="absolute -bottom-8 -left-8 md:-bottom-10 md:-left-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-royal-dark flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
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
                    Divine · Love · 26 · Save · the · Date ·
                  </textPath>
                </text>
              </svg>
              <span className="font-serif text-gold-light text-xl md:text-2xl italic">
                &amp;
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
