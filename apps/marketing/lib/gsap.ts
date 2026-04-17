"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

export function splitChars(text: string): string[] {
  return Array.from(text);
}

export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}
