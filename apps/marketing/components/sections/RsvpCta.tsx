"use client";

import { useRef } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SplitReveal from "@/components/ui/SplitReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import Ornament from "@/components/ui/Ornament";
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
      className="relative noise-overlay bg-gradient-to-b from-ivory via-cream to-ivory"
    >
      <div ref={scope} className="relative z-[2] max-w-3xl mx-auto text-center">
        <SplitReveal
          text="Will you join us?"
          as="p"
          data-rsvp-label
          className="font-sans text-[10px] tracking-[0.55em] uppercase text-gold-dark mb-4"
        />
        <SplitReveal
          text="RSVP"
          as="h2"
          data-rsvp-title
          className="font-serif text-6xl md:text-8xl font-light text-royal tracking-[0.02em]"
        />
        <div data-rsvp-ornament className="mt-8 flex justify-center text-gold">
          <Ornament variant="wave" className="w-44 md:w-52" />
        </div>

        <p
          data-rsvp-copy
          className="mt-10 font-sans text-sm md:text-base text-warm-600 leading-[1.95] max-w-xl mx-auto opacity-0"
        >
          Please let us know whether you can join us. The RSVP portal is open —
          you&rsquo;ll find it waiting with your name on the guest list.
        </p>

        <div data-rsvp-cta className="mt-12 inline-block opacity-0">
          <MagneticButton href={RSVP_URL} strength={0.4} className="group">
            <span className="relative inline-flex items-center gap-4 bg-royal hover:bg-royal-dark text-white font-sans text-[11px] tracking-[0.35em] uppercase pl-10 pr-12 py-4 rounded-full transition-colors duration-500 card-emboss">
              <span className="relative">
                Respond to the invitation
              </span>
              <span
                aria-hidden
                className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/10 text-gold-light transition-transform duration-500 group-hover:translate-x-1"
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
