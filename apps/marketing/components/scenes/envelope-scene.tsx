"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SplitReveal from "@/components/ui/split-reveal";
import Envelope from "@/components/props/envelope";
import FloralGarnish from "@/components/props/floral-garnish";
import VideoFrame from "@/components/props/video-frame";
import { HERO_VIDEO } from "@/lib/scenes";
import { HERO_SLIDES } from "@/lib/constants";
import { useGSAP, gsap } from "@/lib/gsap";

/**
 * Scene 1 — The Envelope.
 *
 * A cinematic full-bleed video backdrop (muted, palette-washed) over which
 * a large royal-blue envelope hovers, ornamented with floral garnish and a
 * wax-seal monogram. A script + display headline reads "The countdown to
 * forever begins now." Clicking the envelope triggers the flap-open
 * sequence (wax breaks, flap rotates). Scroll also drives the open on
 * scrub for users who never click.
 */
export default function EnvelopeScene() {
  const scope = useRef<HTMLElement>(null);
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      // Initial reveal timeline — headline + envelope fade-in
      gsap.set("[data-envelope-eyebrow] [data-char]", { y: "100%" });

      const reveal = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: 0.35,
      });

      reveal
        .fromTo(
          "[data-envelope-backdrop]",
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 2, ease: "power2.out" },
        )
        .to(
          "[data-envelope-eyebrow] [data-char]",
          { y: 0, duration: 0.9, stagger: 0.018 },
          "-=1.4",
        )
        .fromTo(
          "[data-envelope-root]",
          { opacity: 0, y: 40, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "expo.out" },
          "-=0.6",
        )
        .fromTo(
          "[data-envelope-floral]",
          { opacity: 0, y: 16, rotate: -4 },
          { opacity: 1, y: 0, rotate: 0, duration: 1.2, stagger: 0.15 },
          "-=1.0",
        )
        .fromTo(
          "[data-envelope-title-line]",
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.08 },
          "-=0.7",
        )
        .fromTo(
          "[data-envelope-cta]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.3",
        );

      // Continuous scroll-hint bob
      gsap.to("[data-envelope-scroll-hint-line]", {
        y: 6,
        yoyo: true,
        repeat: -1,
        duration: 1.6,
        ease: "sine.inOut",
      });
    },
    { scope },
  );

  const handleEnvelopeClick = () => {
    if (opened) return;
    setOpened(true);

    // Open ceremony — seal cracks off, flap rotates up, paper fades, then route
    const tl = gsap.timeline({
      onComplete: () => router.push("/story"),
    });

    tl.to(
      "[data-envelope-seal]",
      {
        scale: 1.15,
        rotate: -18,
        y: -12,
        duration: 0.3,
        ease: "back.in(2)",
      },
      0,
    )
      .to(
        "[data-envelope-seal]",
        {
          scale: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        },
        "+=0.05",
      )
      .to(
        "[data-envelope-flap]",
        {
          rotateX: -168,
          duration: 1.1,
          ease: "power3.inOut",
        },
        "-=0.25",
      )
      .to(
        "[data-envelope-root]",
        {
          y: -12,
          scale: 1.04,
          duration: 1.1,
          ease: "power2.inOut",
        },
        "-=1.0",
      )
      .to(
        "[data-envelope-cluster]",
        {
          y: -28,
          opacity: 0,
          duration: 0.7,
          ease: "power2.in",
        },
        "-=0.2",
      );
  };

  return (
    <section
      ref={scope}
      id="top"
      className="relative h-screen overflow-hidden"
    >
      {/* Video backdrop */}
      <div
        data-envelope-backdrop
        className="absolute inset-0 will-change-transform opacity-0"
      >
        <VideoFrame
          src={HERO_VIDEO}
          poster={HERO_SLIDES[0]}
          className="absolute inset-0"
          videoClassName="scale-[1.05]"
          desktopOnly
        />
        {/* Palette wash — duotone royal blue */}
        <div className="absolute inset-0 bg-[#041d4a] mix-blend-color opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-b from-royal-dark/80 via-royal/55 to-royal-dark/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.08)_0%,_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_25%,_rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* Content cluster */}
      <div
        data-envelope-cluster
        className="relative z-[2] h-full flex flex-col items-center justify-center text-center px-6 pt-16 md:pt-20"
      >
        <SplitReveal
          text="An Invitation"
          as="p"
          data-envelope-eyebrow
          className="font-sans text-[10px] md:text-xs uppercase tracking-[0.6em] text-gold-light/90 mb-5 md:mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
        />

        {/* Envelope + florals */}
        <button
          type="button"
          onClick={handleEnvelopeClick}
          aria-label="Open the invitation"
          className="relative group cursor-pointer focus-visible:outline-none"
        >
          <div data-envelope-floral className="pointer-events-none opacity-0">
            <FloralGarnish position="top-left" className="z-[3]" />
          </div>
          <div data-envelope-floral className="pointer-events-none opacity-0">
            <FloralGarnish position="bottom-right" className="z-[3]" />
          </div>

          <Envelope
            initials="DL"
            aspect={1.55}
            className="w-[min(58vw,460px)] transition-transform duration-500 ease-out group-hover:-translate-y-1"
          />
        </button>

        {/* Headline */}
        <h1 className="relative z-[2] mt-5 md:mt-6 font-serif text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.75)] leading-[1.0]">
          <span
            data-envelope-title-line
            className="block text-lg md:text-2xl lg:text-3xl font-light tracking-wide opacity-0"
          >
            The countdown to
          </span>
          <span
            data-envelope-title-line
            className="block -my-1 md:my-0 font-script text-gold-light text-[3.5rem] md:text-6xl lg:text-7xl opacity-0 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
            style={{ letterSpacing: 0 }}
          >
            forever
          </span>
          <span
            data-envelope-title-line
            className="block text-lg md:text-2xl lg:text-3xl font-light tracking-wide opacity-0"
          >
            begins now
          </span>
        </h1>

        <p
          data-envelope-cta
          className="opacity-0 mt-4 md:mt-6 font-sans text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-gold-light/80"
        >
          {opened ? "Opening…" : "Click to open"}
        </p>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[2] opacity-60">
        <div
          data-envelope-scroll-hint-line
          className="w-px h-6 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </div>
    </section>
  );
}
