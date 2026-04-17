"use client";

import { useRef } from "react";
import Image from "next/image";
import CountdownTimer from "@/components/ui/CountdownTimer";
import SplitReveal from "@/components/ui/SplitReveal";
import Ornament from "@/components/ui/Ornament";
import MagneticButton from "@/components/ui/MagneticButton";
import { COUPLE } from "@/lib/constants";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const RSVP_URL = process.env.NEXT_PUBLIC_RSVP_URL || "/rsvp";

export default function Hero() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      gsap.set("[data-hero-label] [data-char]", { y: "100%" });
      gsap.set("[data-hero-name] [data-char]", { y: "100%" });
      gsap.set("[data-hero-date] [data-char]", { y: "100%" });

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: 0.15,
      });

      tl.to("[data-hero-ornament]", {
        opacity: 1,
        scaleX: 1,
        duration: 1.1,
      });

      tl.to(
        "[data-hero-label] [data-char]",
        {
          y: 0,
          duration: 0.9,
          stagger: 0.012,
        },
        "-=0.7",
      );

      tl.fromTo(
        "[data-hero-seal]",
        { opacity: 0, scale: 0.7, rotate: -6 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1.2,
          ease: "expo.out",
        },
        "-=0.5",
      );

      tl.fromTo(
        "[data-hero-seal-glow]",
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 1.6, ease: "power3.out" },
        "-=1.2",
      );

      tl.to(
        "[data-hero-name] [data-char]",
        {
          y: 0,
          duration: 1.1,
          stagger: 0.018,
        },
        "-=0.6",
      );

      tl.fromTo(
        "[data-hero-amp]",
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.9, ease: "expo.out" },
        "-=0.5",
      );

      tl.to(
        "[data-hero-date] [data-char]",
        {
          y: 0,
          duration: 0.9,
          stagger: 0.02,
        },
        "-=0.4",
      );

      tl.fromTo(
        "[data-hero-countdown]",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.3",
      );

      tl.fromTo(
        "[data-hero-cta]",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6",
      );

      tl.fromTo(
        "[data-hero-hash]",
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.4",
      );

      tl.fromTo(
        "[data-hero-scroll]",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.3",
      );

      // Scroll-driven parallax on the background + fade on seal
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set("[data-hero-bg]", { yPercent: p * 18 });
          gsap.set("[data-hero-seal]", {
            scale: 1 + p * 0.12,
            opacity: 1 - p * 0.9,
          });
          gsap.set("[data-hero-cluster]", { y: p * -40, opacity: 1 - p * 0.6 });
        },
      });

      // Continuous scroll-hint bob
      gsap.to("[data-hero-scroll-line]", {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.6,
        ease: "sine.inOut",
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="top"
      className="relative min-h-screen overflow-hidden noise-overlay"
    >
      <div
        data-hero-bg
        className="absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#041d4a] via-royal-dark to-royal" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,180,196,0.12)_0%,_transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
      </div>

      <div
        data-hero-cluster
        className="relative z-[2] min-h-screen flex flex-col items-center justify-center text-center px-6 py-28"
      >
        <div
          data-hero-ornament
          className="mb-8 origin-center opacity-0 scale-x-0 text-gold-light/70"
          style={{ willChange: "transform, opacity" }}
        >
          <Ornament variant="wave" className="w-56 md:w-72" />
        </div>

        <SplitReveal
          text="Save · the · Date"
          as="p"
          data-hero-label
          className="font-sans text-[10px] md:text-xs uppercase tracking-[0.55em] text-gold-light/80 mb-10 md:mb-14"
        />

        <div className="relative mb-10 md:mb-14">
          <div
            data-hero-seal-glow
            aria-hidden
            className="absolute -inset-12 md:-inset-16 rounded-full bg-gold/[0.08] blur-3xl opacity-0"
          />
          <div
            data-hero-seal-glow
            aria-hidden
            className="absolute -inset-4 md:-inset-6 rounded-full bg-gold/[0.12] blur-xl opacity-0"
          />
          <div
            data-hero-seal
            className="relative opacity-0"
            style={{ willChange: "transform, opacity" }}
          >
            <Image
              src="/logo/monogram-white-on-blue.jpeg"
              alt="Divine Love Monogram"
              width={240}
              height={240}
              className="relative w-[150px] h-[150px] md:w-[220px] md:h-[220px] rounded-full object-cover shadow-[0_0_80px_rgba(168,180,196,0.18),0_28px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10"
              priority
            />
          </div>
        </div>

        <h1 className="font-serif leading-none">
          <SplitReveal
            text={COUPLE.partner1}
            as="span"
            data-hero-name
            className="block text-4xl md:text-7xl lg:text-[5.5rem] font-light text-white tracking-wide"
          />

          <span
            data-hero-amp
            className="block my-3 md:my-5 origin-center"
          >
            <span className="inline-flex items-center gap-4 md:gap-6">
              <span className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="text-2xl md:text-3xl lg:text-4xl font-light italic text-gold gold-shimmer">
                &amp;
              </span>
              <span className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-gold/60" />
            </span>
          </span>

          <SplitReveal
            text={COUPLE.partner2}
            as="span"
            data-hero-name
            className="block text-4xl md:text-7xl lg:text-[5.5rem] font-light text-white tracking-wide"
          />
        </h1>

        <div className="mt-10 md:mt-12 flex items-center gap-4 text-white/70">
          <span className="h-px w-8 bg-white/20" />
          <SplitReveal
            text="20 · 06 · 26"
            as="p"
            data-hero-date
            className="font-serif text-lg md:text-2xl italic tracking-[0.25em]"
          />
          <span className="h-px w-8 bg-white/20" />
        </div>

        <div data-hero-countdown className="mt-12 md:mt-16 opacity-0">
          <CountdownTimer />
        </div>

        <div data-hero-cta className="mt-10 opacity-0">
          <MagneticButton
            href={RSVP_URL}
            strength={0.35}
            className="group relative"
          >
            <span className="relative flex items-center gap-3 rounded-full border border-gold/40 bg-white/[0.04] px-9 py-3.5 font-sans text-[11px] uppercase tracking-[0.35em] text-gold-light/90 backdrop-blur-sm transition-colors duration-500 hover:border-gold hover:text-white">
              <span className="h-px w-4 bg-gold-light/50 transition-all duration-500 group-hover:w-8 group-hover:bg-gold" />
              Respond to the invitation
            </span>
          </MagneticButton>
        </div>

        <p
          data-hero-hash
          className="font-sans text-[10px] tracking-[0.45em] text-gold-light/40 mt-10 opacity-0"
        >
          {COUPLE.hashtag}
        </p>

        <div
          data-hero-scroll
          className="absolute bottom-8 opacity-0"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-sans text-[8px] tracking-[0.35em] uppercase text-white/30">
              Scroll
            </span>
            <div
              data-hero-scroll-line
              className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
