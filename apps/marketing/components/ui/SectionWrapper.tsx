"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function SectionWrapper({
  id,
  className = "",
  children,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: ref },
  );

  // Keep hook alive without eslint complaining about unused ScrollTrigger
  void ScrollTrigger;

  return (
    <section
      ref={ref}
      id={id}
      className={`px-6 py-24 md:py-32 ${className}`}
    >
      {children}
    </section>
  );
}
