"use client";

import { useRef } from "react";
import Image from "next/image";
import SplitReveal from "@/components/ui/SplitReveal";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const TIMELINE = [
  {
    year: "2020",
    date: "January 2020",
    title: "First Meeting",
    description:
      "We met at a mutual friend's gathering and instantly connected over our shared love of adventure.",
  },
  {
    year: "2020",
    date: "June 2020",
    title: "First Date",
    description:
      "A quiet dinner turned into hours of conversation. We knew something special was beginning.",
  },
  {
    year: "2022",
    date: "December 2022",
    title: "The Proposal",
    description:
      "Under a canopy of stars, the question was asked, and without hesitation, the answer was yes.",
  },
  {
    year: "2026",
    date: "June 2026",
    title: "The Wedding",
    description:
      "And now we invite you to celebrate the beginning of our forever with us.",
  },
];

export default function OurStory() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      // Heading kinetic reveal
      gsap.set("[data-story-label] [data-char]", { y: "100%" });
      gsap.set("[data-story-title] [data-char]", { y: "100%" });

      gsap.to("[data-story-label] [data-char]", {
        y: 0,
        duration: 0.9,
        stagger: 0.015,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-story-label]",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to("[data-story-title] [data-char]", {
        y: 0,
        duration: 1,
        stagger: 0.02,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-story-title]",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.fromTo(
        "[data-story-rule]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-story-rule]",
            start: "top 90%",
          },
        },
      );

      // Timeline entries — slide from alternating sides with subtle rotation
      gsap.utils
        .toArray<HTMLElement>("[data-story-item]")
        .forEach((item, i) => {
          gsap.fromTo(
            item,
            {
              opacity: 0,
              y: 50,
              x: i % 2 === 0 ? -30 : 30,
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              duration: 1,
              ease: "expo.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

      // Slowly drift the watermark monogram as the section scrolls
      gsap.to("[data-story-watermark]", {
        yPercent: -8,
        rotate: 8,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope },
  );

  void ScrollTrigger;

  return (
    <section
      ref={scope}
      id="story"
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-royal-dark via-royal to-royal-dark" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      <div
        data-story-watermark
        className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform"
      >
        <Image
          src="/logo/monogram-white-on-blue.jpeg"
          alt=""
          width={560}
          height={560}
          className="w-[420px] h-[420px] md:w-[560px] md:h-[560px] rounded-full opacity-[0.05] blur-sm"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <SplitReveal
            text="How it all began"
            as="p"
            data-story-label
            className="font-sans text-[10px] tracking-[0.5em] uppercase text-white/50 mb-4"
          />
          <SplitReveal
            text="Our Story"
            as="h2"
            data-story-title
            className="font-serif text-5xl md:text-7xl font-light text-white tracking-[0.02em]"
          />
          <div
            data-story-rule
            className="w-20 h-px mx-auto mt-8 bg-gradient-to-r from-transparent via-white/35 to-transparent origin-center"
          />
        </div>

        <div className="space-y-6 md:space-y-10">
          {TIMELINE.map((item) => (
            <div
              key={item.title}
              data-story-item
              className="relative opacity-0"
            >
              <div className="flex items-stretch gap-5 md:gap-8">
                <div className="hidden md:flex flex-col items-center justify-center w-24 shrink-0">
                  <span className="font-serif text-6xl font-light text-white/[0.08] leading-none select-none">
                    {item.year}
                  </span>
                </div>

                <div className="flex flex-col items-center shrink-0 pt-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30 border-2 border-white/50 shrink-0" />
                  <div className="w-px flex-1 bg-gradient-to-b from-white/20 to-transparent" />
                </div>

                <div className="flex-1 pb-4">
                  <div className="group bg-white rounded-lg px-6 py-6 md:px-10 md:py-8 shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_18px_48px_rgba(0,0,0,0.28)] transition-shadow duration-700 stationery-border">
                    <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold">
                      {item.date}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-royal mt-2 mb-3 font-light">
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm md:text-[15px] text-warm-600 leading-[1.9]">
                      {item.description}
                    </p>
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
