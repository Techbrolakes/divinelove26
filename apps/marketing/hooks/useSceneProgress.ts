"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SceneProgressOptions {
  /** CSS selector or ref for the trigger element (defaults to `scope`). */
  trigger?: RefObject<HTMLElement | null>;
  /** ScrollTrigger `start` string. */
  start?: string;
  /** ScrollTrigger `end` string. */
  end?: string;
  /** Pin the trigger element while scrubbing. */
  pin?: boolean;
  /** Smooth scrub (true = discrete scrub, number = lag in seconds). */
  scrub?: boolean | number;
}

/**
 * Drives a normalized 0..1 progress for a scene that pins while scrolling.
 * All scene props read from this single source so their transforms stay in sync.
 *
 * Returns a ref that callers attach to the pinned scene root, plus the current
 * progress as a ref (for GSAP timelines) AND as state (for React-rendered UI).
 */
export function useSceneProgress(
  scope: RefObject<HTMLElement | null>,
  options: SceneProgressOptions = {},
) {
  const {
    trigger,
    start = "top top",
    end = "+=100%",
    pin = true,
    scrub = 0.6,
  } = options;

  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const triggerEl = trigger?.current ?? scope.current;
    if (!triggerEl) return;

    const st = ScrollTrigger.create({
      trigger: triggerEl,
      start,
      end,
      pin,
      scrub,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setProgress(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, [scope, trigger, start, end, pin, scrub]);

  return { progressRef, progress };
}

/**
 * Lightweight intersection observer — reports whether `ref` is ≥ `threshold`
 * visible in the viewport. Used by video props to gate autoplay.
 */
export function useInView(
  ref: RefObject<Element | null>,
  threshold = 0.4,
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setInView(entry.isIntersecting);
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return inView;
}

/**
 * Detects `prefers-reduced-motion`. Scenes skip continuous scrubs and
 * looping videos when this returns true.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
