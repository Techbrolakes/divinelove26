"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CONFETTI_COLORS } from "@/lib/constants";

export default function ConfettiEffect() {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: CONFETTI_COLORS,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: CONFETTI_COLORS,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return null;
}
