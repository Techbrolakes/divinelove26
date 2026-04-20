"use client";

import VideoFrame from "@/components/props/video-frame";
import { HERO_VIDEO } from "@/lib/scenes";
import { HERO_SLIDES } from "@/lib/constants";

/**
 * Shared cinematic backdrop rendered behind every page — the royal-blue
 * duotone video wash. Position-fixed so it persists across page
 * transitions without reloading the video element.
 */
export default function SceneBackdrop() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      <VideoFrame
        src={HERO_VIDEO}
        poster={HERO_SLIDES[0]}
        className="absolute inset-0 w-full h-full"
        videoClassName="w-full h-full scale-[1.05] object-cover"
      />
      {/* Duotone royal-blue wash */}
      <div className="absolute inset-0 bg-[#041d4a] mix-blend-color opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-royal-dark/75 via-royal/40 to-royal-dark/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.08)_0%,_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.6)_100%)]" />
      {/* Diamond lattice film-grain */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
