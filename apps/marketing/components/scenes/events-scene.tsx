"use client";

import { useRef } from "react";
import SceneHeader from "@/components/ui/scene-header";
import WaxSeal from "@/components/props/wax-seal";
import { useGSAP, gsap } from "@/lib/gsap";

const EVENTS = [
  {
    label: "The Ceremony",
    name: "Wedding Ceremony",
    date: "June 20, 2026",
    time: "2:00 PM",
    venue: "Venue Name",
    address: "123 Beautiful Street, City, State",
    dressCode: "Formal Attire",
  },
  {
    label: "The Reception",
    name: "Reception",
    date: "June 20, 2026",
    time: "5:00 PM",
    venue: "Reception Venue",
    address: "456 Celebration Avenue, City, State",
    dressCode: "Formal Attire",
  },
];

/**
 * Events — Ceremony + Reception cards on the shared blue backdrop.
 * Fits within 100vh.
 */
export default function EventsScene() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-events-card]",
        { opacity: 0, y: 24, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.6)",
          stagger: 0.06,
          delay: 0.15,
        },
      );

      gsap.fromTo(
        "[data-events-seal]",
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(2)",
          stagger: 0.06,
          delay: 0.4,
        },
      );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative z-[1] h-screen overflow-hidden flex flex-col items-center justify-center px-6 pt-20 pb-20 md:pb-24"
    >
      <div className="mb-10 md:mb-12">
        <SceneHeader
          id="events"
          eyebrow="Join us to celebrate"
          title="The Celebration"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3 md:gap-7 w-full max-w-4xl">
        {EVENTS.map((ev) => (
          <div
            key={ev.name}
            data-events-card
            className="relative rounded-sm border border-gold/40 text-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] opacity-0"
            style={{
              background:
                "linear-gradient(160deg, #0a2255 0%, #061a43 55%, #04123a 100%)",
              willChange: "transform, opacity",
            }}
          >
            <div className="pointer-events-none absolute inset-2 border border-gold/25" />
            <div className="pointer-events-none absolute inset-[7px] border border-gold/15" />

            {/* Wax-seal accent — lives at top-right of each card */}
            <div
              data-events-seal
              aria-hidden
              className="pointer-events-none absolute -top-5 -right-5 md:-top-6 md:-right-6 z-[3] opacity-0"
              style={{ willChange: "transform, opacity" }}
            >
              <WaxSeal initials="DL" size={52} className="md:hidden" />
              <WaxSeal initials="DL" size={68} className="hidden md:block" />
            </div>

            <div className="relative p-4 md:p-7 text-center">
              <p className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.45em] uppercase text-gold-light/70">
                {ev.label}
              </p>
              <h3 className="mt-1.5 md:mt-2 font-serif text-xl md:text-3xl font-light tracking-wide">
                {ev.name}
              </h3>

              <div className="mt-2.5 md:mt-4 flex items-center justify-center gap-2 md:gap-3">
                <span className="h-px w-6 md:w-8 bg-gold/40" />
                <span className="w-1.5 h-1.5 rotate-45 bg-gold/60" />
                <span className="h-px w-6 md:w-8 bg-gold/40" />
              </div>

              <p className="mt-2.5 md:mt-4 font-serif italic text-gold-light/85 text-sm md:text-lg">
                {ev.date}
              </p>
              <p className="mt-0.5 md:mt-1 font-sans text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.45em] uppercase text-gold">
                {ev.time}
              </p>

              <div className="mt-3 md:mt-5">
                <p className="font-serif text-sm md:text-lg text-white">
                  {ev.venue}
                </p>
                <p className="mt-0.5 md:mt-1 font-sans text-[10px] md:text-[11px] text-white/60 tracking-wide">
                  {ev.address}
                </p>
              </div>

              <div className="mt-3 md:mt-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/[0.04] px-3 md:px-4 py-1 md:py-1.5">
                <span className="w-1 h-1 rounded-full bg-gold" />
                <span className="font-sans text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-gold-light/85">
                  {ev.dressCode}
                </span>
                <span className="w-1 h-1 rounded-full bg-gold" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
