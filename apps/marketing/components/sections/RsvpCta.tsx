"use client";

import { useRef } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SplitReveal from "@/components/ui/SplitReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import Ornament from "@/components/ui/Ornament";
import { RSVP_BACKDROP } from "@/lib/constants";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const RSVP_URL = process.env.NEXT_PUBLIC_RSVP_URL || "/rsvp";

export default function RsvpCta() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set("[data-rsvp-label] [data-char]", { y: "100%" });
      gsap.set("[data-rsvp-title] [data-char]", { y: "100%" });

      gsap.to("[data-rsvp-label] [data-char]", {
        y: 0,
        duration: 0.9,
        stagger: 0.012,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-rsvp-label]",
          start: "top 85%",
        },
      });

      gsap.to("[data-rsvp-title] [data-char]", {
        y: 0,
        duration: 1.2,
        stagger: 0.025,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-rsvp-title]",
          start: "top 85%",
        },
      });

      gsap.fromTo(
        "[data-rsvp-copy]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-rsvp-copy]",
            start: "top 88%",
          },
        },
      );

      gsap.fromTo(
        "[data-rsvp-cta]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-rsvp-cta]",
            start: "top 88%",
          },
        },
      );

      // Ken burns on backdrop
      gsap.fromTo(
        "[data-rsvp-bg]",
        { scale: 1.1, yPercent: 0 },
        {
          scale: 1.22,
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-rsvp-bg]",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );

      gsap.utils
        .toArray<SVGPathElement>("[data-rsvp-ornament] path")
        .forEach((p) => {
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
              trigger: p,
              start: "top 90%",
            },
          });
        });
    },
    { scope },
  );

  void ScrollTrigger;

  return (
    <SectionWrapper
      id="rsvp"
      className="relative noise-overlay overflow-hidden bg-royal-dark"
    >
      {/* Full-bleed photo backdrop */}
      <div
        data-rsvp-bg
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={RSVP_BACKDROP}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          quality={88}
          aria-hidden="true"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-royal-dark/85 via-royal/70 to-royal-dark/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.14)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.55)_100%)]" />

      <div ref={scope} className="relative z-[2] max-w-3xl mx-auto text-center">
        <SplitReveal
          text="Will you join us?"
          as="p"
          data-rsvp-label
          className="font-sans text-[10px] tracking-[0.55em] uppercase text-gold-light/80 mb-4"
        />
        <SplitReveal
          text="RSVP"
          as="h2"
          data-rsvp-title
          className="font-serif text-6xl md:text-8xl font-light text-white tracking-[0.02em] drop-shadow-[0_6px_28px_rgba(0,0,0,0.55)]"
        />
        <div data-rsvp-ornament className="mt-8 flex justify-center text-gold">
          <Ornament variant="wave" className="w-44 md:w-52" />
        </div>

        <p
          data-rsvp-copy
          className="mt-10 font-sans text-sm md:text-base text-white/80 leading-[1.95] max-w-xl mx-auto opacity-0"
        >
          Please let us know whether you can join us. The RSVP portal is open —
          you&rsquo;ll find it waiting with your name on the guest list.
        </p>

        <div data-rsvp-cta className="mt-12 inline-block opacity-0">
          <MagneticButton href={RSVP_URL} strength={0.4} className="group">
            <span className="relative inline-flex items-center gap-4 bg-white/[0.06] hover:bg-white/[0.12] text-white font-sans text-[11px] tracking-[0.35em] uppercase pl-10 pr-12 py-4 rounded-full border border-gold/50 hover:border-gold backdrop-blur-md transition-colors duration-500">
              <span className="relative">
                Respond to the invitation
              </span>
              <span
                aria-hidden
                className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gold/20 text-gold-light transition-transform duration-500 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </span>
          </MagneticButton>
        </div>
      </div>
    </SectionWrapper>
  );
}
