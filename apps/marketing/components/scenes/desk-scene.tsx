"use client";

import { useRef } from "react";
import SplitReveal from "@/components/ui/split-reveal";
import Ornament from "@/components/ui/ornament";
import Passport from "@/components/props/passport";
import Matchbook from "@/components/props/matchbook";
import LaceDoily from "@/components/props/lace-doily";
import Polaroid from "@/components/props/polaroid";
import FloralGarnish from "@/components/props/floral-garnish";
import { STORY_PHOTOS } from "@/lib/constants";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Scene 3 — The Desk.
 *
 * A warm parchment "desk" on which physical stationery is scattered: a
 * passport for Events, a stack of polaroids for Gallery, a matchbook for
 * Gifts, and a lace doily crowned by the words "Our Story" linking to
 * the prose scene. Hovering each object lifts and tilts it; clicking
 * scrolls the page to that scene.
 */
export default function DeskScene() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      gsap.set("[data-desk-eyebrow] [data-char]", { y: "100%" });
      gsap.set("[data-desk-title] [data-char]", { y: "100%" });

      gsap.to("[data-desk-eyebrow] [data-char]", {
        y: 0,
        duration: 0.8,
        stagger: 0.015,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-desk-eyebrow]", start: "top 85%" },
      });

      gsap.to("[data-desk-title] [data-char]", {
        y: 0,
        duration: 1,
        stagger: 0.022,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-desk-title]", start: "top 85%" },
      });

      // Fan the props out of the center on scroll
      gsap.utils
        .toArray<HTMLElement>("[data-desk-prop]")
        .forEach((el, i) => {
          const rot = (parseFloat(el.dataset.tilt ?? "0") || 0) + (i - 1.5) * 1.5;
          gsap.fromTo(
            el,
            {
              y: 60,
              opacity: 0,
              rotate: rot - 10,
              scale: 0.92,
            },
            {
              y: 0,
              opacity: 1,
              rotate: rot,
              scale: 1,
              duration: 1.1,
              ease: "expo.out",
              delay: i * 0.1,
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
              },
            },
          );

          // Gentle float on hover — GSAP handles it so reduced-motion CSS rule catches
          el.addEventListener("mouseenter", () => {
            gsap.to(el, { y: -10, rotate: rot * 0.4, duration: 0.5, ease: "power2.out" });
          });
          el.addEventListener("mouseleave", () => {
            gsap.to(el, { y: 0, rotate: rot, duration: 0.6, ease: "power2.out" });
          });
        });
    },
    { scope },
  );

  void ScrollTrigger;

  return (
    <section
      ref={scope}
      id="desk"
      className="relative py-24 md:py-32 px-6 overflow-hidden parchment-deep"
    >
      {/* Paper grain overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.22] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.1\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: "280px 280px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(90,60,30,0.25)_100%)] pointer-events-none" />

      {/* Corner floral accents */}
      <FloralGarnish
        position="top-right"
        size="w-36 md:w-56"
        className="z-[2]"
      />
      <FloralGarnish
        position="bottom-left"
        size="w-36 md:w-56"
        className="z-[2]"
      />

      <div className="relative z-[3] max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <SplitReveal
            text="Everything you need"
            as="p"
            data-desk-eyebrow
            className="font-sans text-[10px] md:text-xs tracking-[0.55em] uppercase text-ink/55 mb-4"
          />
          <SplitReveal
            text="The Details"
            as="h2"
            data-desk-title
            className="font-serif text-5xl md:text-7xl font-light text-ink tracking-[0.02em]"
          />
          <div className="mt-6 flex justify-center text-gold-dark/70">
            <Ornament variant="wave" className="w-44" />
          </div>
          <p className="mt-5 font-serif italic text-ink/65 text-lg max-w-xl mx-auto">
            A little stack of things we hope you&rsquo;ll take with you.
          </p>
        </div>

        {/* Desk arrangement — responsive grid */}
        <div className="relative grid grid-cols-2 md:grid-cols-12 gap-y-14 md:gap-y-0 md:gap-x-8 items-center">
          {/* Passport (Events) */}
          <div
            data-desk-prop
            data-tilt="-5"
            className="col-span-1 md:col-span-3 flex justify-center md:justify-end opacity-0"
          >
            <Passport
              label="Events"
              subtitle="Ceremony · Reception"
              href="/events"
              width={200}
            />
          </div>

          {/* Polaroid stack (Gallery) */}
          <div
            data-desk-prop
            data-tilt="3"
            className="col-span-1 md:col-span-3 flex justify-center opacity-0"
          >
            <a
              href="/gallery"
              className="group relative inline-block focus-visible:outline-none"
              aria-label="Go to Gallery"
            >
              <div className="relative">
                <Polaroid
                  src={STORY_PHOTOS[2]}
                  alt="Gallery polaroid back"
                  tilt={-7}
                  width={180}
                  caption="Gallery"
                  className="absolute -left-6 -top-4 z-[1] opacity-80"
                />
                <Polaroid
                  src={STORY_PHOTOS[1]}
                  alt="Gallery polaroid middle"
                  tilt={4}
                  width={180}
                  caption=""
                  className="absolute -right-4 top-2 z-[2] opacity-90"
                />
                <Polaroid
                  src={STORY_PHOTOS[0]}
                  alt="Gallery top polaroid"
                  tilt={-1}
                  width={200}
                  caption="the full album"
                  className="relative z-[3]"
                />
              </div>
            </a>
          </div>

          {/* Lace doily + Our Story */}
          <div
            data-desk-prop
            data-tilt="0"
            className="col-span-2 md:col-span-3 flex justify-center opacity-0"
          >
            <a
              href="#chapters"
              className="group relative inline-flex items-center justify-center focus-visible:outline-none"
              aria-label="Jump to the chapters"
            >
              <LaceDoily size={260} className="w-[200px] md:w-[240px] h-auto" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-ink/60">
                  Read
                </p>
                <p className="font-script text-ink text-5xl md:text-6xl leading-none">
                  Our Story
                </p>
              </div>
            </a>
          </div>

          {/* Matchbook (Gifts) */}
          <div
            data-desk-prop
            data-tilt="6"
            className="col-span-1 md:col-span-3 flex justify-center md:justify-start opacity-0"
          >
            <Matchbook label="Gifts" href="/gifts" width={140} />
          </div>
        </div>
      </div>
    </section>
  );
}
