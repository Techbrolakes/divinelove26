"use client";

import { useRef, type AnchorHTMLAttributes } from "react";
import { useGSAP, gsap } from "@/lib/gsap";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  strength?: number;
}

export default function MagneticButton({
  children,
  strength = 0.3,
  className = "",
  ...rest
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const target = inner.current;
      if (!el || !target) return;

      const qx = gsap.quickTo(target, "x", {
        duration: 0.6,
        ease: "power3.out",
      });
      const qy = gsap.quickTo(target, "y", {
        duration: 0.6,
        ease: "power3.out",
      });

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - rect.left - rect.width / 2) * strength;
        const relY = (e.clientY - rect.top - rect.height / 2) * strength;
        qx(relX);
        qy(relY);
      };
      const onLeave = () => {
        qx(0);
        qy(0);
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: ref, dependencies: [strength] },
  );

  return (
    <a
      ref={ref}
      className={`inline-block will-change-transform ${className}`}
      {...rest}
    >
      <span ref={inner} className="inline-block will-change-transform">
        {children}
      </span>
    </a>
  );
}
