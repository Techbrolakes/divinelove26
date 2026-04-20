"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  usePrefersReducedMotion,
} from "@/hooks/useSceneProgress";

interface VideoFrameProps {
  src: string;
  poster?: string;
  className?: string;
  /** Classes applied to the inner <video> element itself. */
  videoClassName?: string;
  /** IntersectionObserver threshold for autoplay (0..1). */
  playThreshold?: number;
  /** Suppress mobile playback and show poster only (≤ 768 px). */
  desktopOnly?: boolean;
}

/**
 * Muted, looped, lazy video prop that only plays while in view and only
 * when the user hasn't requested reduced motion. Otherwise it renders
 * the poster still frame — matching the cinematic intent without cost.
 */
export default function VideoFrame({
  src,
  poster,
  className = "",
  videoClassName = "",
  playThreshold = 0.4,
  desktopOnly = false,
}: VideoFrameProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(rootRef, playThreshold);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduced) {
      video.pause();
      return;
    }
    if (desktopOnly && typeof window !== "undefined" && window.innerWidth < 768) {
      video.pause();
      return;
    }
    if (inView) {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          /* autoplay policy — poster will show */
        });
      }
    } else {
      video.pause();
    }
  }, [inView, reduced, desktopOnly]);

  return (
    <div ref={rootRef} className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        className={`h-full w-full object-cover ${videoClassName}`}
      />
    </div>
  );
}
