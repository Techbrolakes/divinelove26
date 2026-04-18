"use client";

import { useRef } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  reverse?: boolean;
  scrollDriven?: boolean;
}

/**
 * Editorial marquee. Two tracks side-by-side looping seamlessly.
 * `scrollDriven` subtly boosts the marquee's timeScale based on page
 * scroll velocity for a reactive, organic rhythm.
 */
export default function Marquee({
  children,
  className = "",
  speed = 40,
  reverse = false,
  scrollDriven = false,
}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!trackRef.current) return;
      const track = trackRef.current;
      const width = track.scrollWidth / 2;
      const direction = reverse ? 1 : -1;

      gsap.set(track, { x: 0 });
      const base = gsap.to(track, {
        x: direction * width,
        duration: speed,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (value: string) => {
            const n = parseFloat(value);
            const wrapped = reverse
              ? ((n % width) + width) % width
              : -(((-n) % width + width) % width);
            return `${wrapped}px`;
          },
        },
      });

      if (scrollDriven && rootRef.current) {
        const st = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const target = 1 + Math.abs(self.getVelocity()) / 2500;
            gsap.to(base, {
              timeScale: Math.min(target, 4),
              overwrite: true,
              duration: 0.3,
            });
          },
        });
        return () => {
          st.kill();
          base.kill();
        };
      }
      return () => {
        base.kill();
      };
    },
    { scope: rootRef, dependencies: [speed, reverse, scrollDriven] },
  );

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden whitespace-nowrap ${className}`}
    >
      <div
        ref={trackRef}
        className="inline-flex items-center will-change-transform"
      >
        <div className="inline-flex items-center shrink-0">{children}</div>
        <div
          className="inline-flex items-center shrink-0"
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
