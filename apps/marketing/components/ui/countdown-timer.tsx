"use client";

import { useEffect, useRef } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { WEDDING_DATE } from "@/lib/constants";
import { gsap } from "gsap";

function FlipDigit({ value, label }: { value: number; label: string }) {
  const currentRef = useRef<HTMLSpanElement>(null);
  const nextRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    if (value === prevValueRef.current) return;
    const cur = currentRef.current;
    const nxt = nextRef.current;
    if (!cur || !nxt) return;

    nxt.textContent = String(value).padStart(2, "0");

    const tl = gsap.timeline();
    tl.fromTo(
      nxt,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
      0,
    );
    tl.to(
      cur,
      { yPercent: 100, opacity: 0, duration: 0.45, ease: "power3.in" },
      0,
    );
    tl.call(() => {
      cur.textContent = String(value).padStart(2, "0");
      gsap.set(cur, { yPercent: 0, opacity: 1 });
      gsap.set(nxt, { yPercent: -100, opacity: 0 });
    });

    prevValueRef.current = value;
  }, [value]);

  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border border-white/[0.06] rounded-sm bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        <span
          ref={currentRef}
          className="absolute inset-0 flex items-center justify-center font-serif text-3xl md:text-4xl font-light text-white/90 tabular-nums"
        >
          {display}
        </span>
        <span
          ref={nextRef}
          className="absolute inset-0 flex items-center justify-center font-serif text-3xl md:text-4xl font-light text-white/90 tabular-nums opacity-0"
          style={{ transform: "translateY(-100%)" }}
          aria-hidden="true"
        >
          {display}
        </span>

        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/30" />
        <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold/30" />
        <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold/30" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold/30" />
      </div>
      <span className="text-[9px] tracking-[0.35em] uppercase text-gold-light/50 mt-3 font-sans">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const { days, hours, minutes, seconds, isExpired } =
    useCountdown(WEDDING_DATE);

  if (isExpired) {
    return (
      <p className="font-serif text-2xl text-gold-light italic">
        The celebration has begun!
      </p>
    );
  }

  return (
    <div className="flex items-center gap-4 md:gap-6">
      <FlipDigit value={days} label="Days" />
      <span className="font-serif text-xl text-gold/30 -mt-6 select-none">:</span>
      <FlipDigit value={hours} label="Hours" />
      <span className="font-serif text-xl text-gold/30 -mt-6 select-none">:</span>
      <FlipDigit value={minutes} label="Mins" />
      <span className="font-serif text-xl text-gold/30 -mt-6 select-none">:</span>
      <FlipDigit value={seconds} label="Secs" />
    </div>
  );
}
