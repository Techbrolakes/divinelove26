"use client";

import { useRef } from "react";
import Image from "next/image";
import SplitReveal from "@/components/ui/SplitReveal";
import Ornament from "@/components/ui/Ornament";
import { EVENTS_BACKDROP } from "@/lib/constants";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const EVENTS = [
  {
    name: "Wedding Ceremony",
    date: "June 20, 2026",
    time: "2:00 PM",
    venue: "Venue Name",
    address: "123 Beautiful Street, City, State",
    dressCode: "Formal Attire",
    description:
      "Join us as we exchange vows and begin our journey together as one.",
    label: "The Ceremony",
    photo: "/gallery/prewedding-06.jpg",
  },
  {
    name: "Reception",
    date: "June 20, 2026",
    time: "5:00 PM",
    venue: "Reception Venue",
    address: "456 Celebration Avenue, City, State",
    dressCode: "Formal Attire",
    description:
      "Dinner, dancing, and celebration. We can't wait to share this joyous evening with you.",
    label: "The Reception",
    photo: "/gallery/prewedding-16.jpg",
  },
];

export default function EventDetails() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.set("[data-events-label] [data-char]", { y: "100%" });
      gsap.set("[data-events-title] [data-char]", { y: "100%" });

      gsap.to("[data-events-label] [data-char]", {
        y: 0,
        duration: 0.9,
        stagger: 0.015,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-events-label]",
          start: "top 85%",
        },
      });

      gsap.to("[data-events-title] [data-char]", {
        y: 0,
        duration: 1.1,
        stagger: 0.022,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-events-title]",
          start: "top 85%",
        },
      });

      gsap.utils
        .toArray<HTMLElement>("[data-event-card]")
        .forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 60, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.1,
              ease: "expo.out",
              delay: i * 0.12,
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
              },
            },
          );
        });

      gsap.utils
        .toArray<SVGPathElement>("[data-events-flourish] path")
        .forEach((path) => {
          const length = (() => {
            try {
              return path.getTotalLength();
            } catch {
              return 200;
            }
          })();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: path,
              start: "top 90%",
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
      id="events"
      className="relative py-28 md:py-36 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-ivory to-cream" />
      <div className="absolute inset-0 noise-overlay" />

      {/* Faint photo accent top-band — gives the creamy section an anchor */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[55%] pointer-events-none overflow-hidden"
      >
        <Image
          src={EVENTS_BACKDROP}
          alt=""
          fill
          className="object-cover opacity-[0.09]"
          sizes="100vw"
          quality={70}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/40 via-cream/70 to-cream" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-20 md:mb-24">
          <SplitReveal
            text="Join us to celebrate"
            as="p"
            data-events-label
            className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold-dark mb-4"
          />
          <SplitReveal
            text="Event Details"
            as="h2"
            data-events-title
            className="font-serif text-5xl md:text-7xl font-light text-royal tracking-[0.02em]"
          />
          <div
            data-events-flourish
            className="mt-8 flex justify-center text-gold"
          >
            <Ornament variant="wave" className="w-44 md:w-52" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {EVENTS.map((event) => (
            <div
              key={event.name}
              data-event-card
              className="group relative opacity-0"
            >
              <div className="relative bg-white rounded-xl overflow-hidden shadow-[0_2px_20px_rgba(11,61,145,0.06)] hover:shadow-[0_18px_60px_rgba(11,61,145,0.14)] transition-shadow duration-700 stationery-border">
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <Image
                    src={event.photo}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={86}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-royal-dark/75 via-royal/60 to-royal-dark/90" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.12)_0%,_transparent_65%)]" />
                  <div className="relative z-[2] h-full flex flex-col items-center justify-center px-8 py-7 text-center">
                    <p className="font-sans text-[9px] tracking-[0.45em] uppercase text-gold-light/80 mb-3">
                      {event.label}
                    </p>
                    <h3 className="font-serif text-3xl md:text-4xl text-white font-light tracking-wide drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]">
                      {event.name}
                    </h3>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="h-px w-8 bg-gold/50" />
                      <span className="w-1.5 h-1.5 rotate-45 bg-gold/80" />
                      <span className="h-px w-8 bg-gold/50" />
                    </div>
                  </div>
                </div>

                <div className="px-8 py-10 md:px-12 md:py-12 text-center">
                  <p className="font-serif text-xl md:text-2xl text-royal italic">
                    {event.date}
                  </p>
                  <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold mt-2 mb-8">
                    {event.time}
                  </p>

                  <div className="flex items-center justify-center gap-3 mb-8">
                    <span className="h-px w-10 bg-royal-100" />
                    <span className="w-1.5 h-1.5 rotate-45 bg-gold/60" />
                    <span className="h-px w-10 bg-royal-100" />
                  </div>

                  <div className="mb-8">
                    <p className="font-serif text-lg text-royal-700 mb-1">
                      {event.venue}
                    </p>
                    <p className="font-sans text-xs text-warm-400 tracking-wide">
                      {event.address}
                    </p>
                  </div>

                  <p className="font-sans text-[14px] text-warm-500 leading-[1.9] mb-8 max-w-sm mx-auto">
                    {event.description}
                  </p>

                  <div className="inline-flex items-center gap-2.5 bg-royal-50/60 px-6 py-2.5 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-gold" />
                    <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-royal-600">
                      {event.dressCode}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gold" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
