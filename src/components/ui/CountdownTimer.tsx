"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { WEDDING_DATE } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border border-white/[0.06] rounded-sm bg-white/[0.02] backdrop-blur-sm">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-serif text-3xl md:text-4xl font-light text-white/90 tabular-nums"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
        {/* Gold accent corner marks */}
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
      <CountdownUnit value={days} label="Days" />
      <span className="font-serif text-xl text-gold/30 -mt-6 select-none">:</span>
      <CountdownUnit value={hours} label="Hours" />
      <span className="font-serif text-xl text-gold/30 -mt-6 select-none">:</span>
      <CountdownUnit value={minutes} label="Mins" />
      <span className="font-serif text-xl text-gold/30 -mt-6 select-none">:</span>
      <CountdownUnit value={seconds} label="Secs" />
    </div>
  );
}
