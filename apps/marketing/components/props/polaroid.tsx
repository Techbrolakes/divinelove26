"use client";

import Image from "next/image";
import { type HTMLAttributes, type ReactNode } from "react";

interface PolaroidProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  caption?: string;
  /** Tilt in degrees. */
  tilt?: number;
  /** Width in pixels (mobile scales down proportionally). */
  width?: number;
  /** Aspect ratio of the photo window (w/h). */
  aspect?: number;
  /** Optional children (e.g. a <VideoFrame/>) to place inside the photo window. */
  children?: ReactNode;
}

/**
 * A photograph in a classic polaroid frame — white paper border, soft
 * shadow, handwritten caption at bottom, slight tilt. The photo window
 * supports both image (via `src`) and arbitrary children (e.g. a video).
 */
export default function Polaroid({
  src,
  alt = "",
  caption,
  tilt = 0,
  width = 240,
  aspect = 0.92,
  className = "",
  children,
  style,
  ...rest
}: PolaroidProps) {
  return (
    <div
      className={`relative inline-block polaroid-shadow ${className}`}
      style={{
        width,
        transform: `rotate(${tilt}deg)`,
        transformOrigin: "50% 55%",
        ...style,
      }}
      {...rest}
    >
      <div className="relative bg-[#fdfaf3] pt-3 px-3 pb-16 rounded-[2px]">
        <div
          className="relative w-full overflow-hidden bg-black/5"
          style={{ aspectRatio: aspect }}
        >
          {children
            ? children
            : src && (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes={`${width}px`}
                  quality={86}
                />
              )}
          {/* subtle inner rim */}
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />
        </div>

        {caption && (
          <p
            className="absolute left-0 right-0 bottom-3 text-center font-script text-ink/80 text-lg leading-none"
            style={{ letterSpacing: 0 }}
          >
            {caption}
          </p>
        )}

        {/* film-stock grain on the border */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2px] opacity-[0.08] mix-blend-multiply"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.4\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: "180px 180px",
          }}
        />
      </div>
    </div>
  );
}
