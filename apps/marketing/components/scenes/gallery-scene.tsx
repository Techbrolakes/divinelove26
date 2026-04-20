"use client";

import { useRef, type ReactNode } from "react";
import SceneHeader from "@/components/ui/scene-header";
import { useGSAP, gsap } from "@/lib/gsap";

type GalleryImage = {
  src: string;
  alt: string;
  /** Optional handwritten caption under the frame — taller tile. */
  caption?: string;
  /** Slight rotation in degrees for a scrapbook feel. */
  tilt?: number;
};

// Shuffled set mixing prewedding, couple portraits, and the new proposal
// shots so the masonry feels like a natural photo album rather than a
// sorted roll. Captions on ~half the tiles to vary heights further.
const IMAGES: GalleryImage[] = [
  { src: "/gallery/proposal-01.jpg", alt: "The moment", caption: "the question", tilt: -1.5 },
  { src: "/gallery/prewedding-09.jpg", alt: "Traditional attire portrait", tilt: 1 },
  { src: "/gallery/proposal-05.jpg", alt: "Proposal — tears", caption: "her yes", tilt: -0.5 },
  { src: "/gallery/couple-01.jpg", alt: "Embracing warmly", tilt: 1.5 },
  { src: "/gallery/proposal-02.jpg", alt: "Kneeling down", caption: "on one knee", tilt: -1 },
  { src: "/gallery/prewedding-17.jpg", alt: "Editorial portrait", tilt: 0.5 },
  { src: "/gallery/proposal-07.jpg", alt: "First embrace", tilt: -1.5 },
  { src: "/gallery/prewedding-14.jpg", alt: "Intimate pose", caption: "you and me", tilt: 1 },
  { src: "/gallery/proposal-03.jpg", alt: "The ring", caption: "sealed", tilt: -0.5 },
  { src: "/gallery/prewedding-20.jpg", alt: "Together in the light", tilt: 1.5 },
  { src: "/gallery/proposal-08.jpg", alt: "Holding hands", tilt: -1 },
  { src: "/gallery/prewedding-05.jpg", alt: "Golden hour portrait", caption: "that evening light", tilt: 0.5 },
  { src: "/gallery/proposal-04.jpg", alt: "Surrounded by flowers", tilt: -1.5 },
  { src: "/gallery/couple-03.jpg", alt: "Laughing together", caption: "laughter", tilt: 1 },
  { src: "/gallery/proposal-09.jpg", alt: "Whispered words", tilt: -0.5 },
  { src: "/gallery/prewedding-15.jpg", alt: "Loving embrace", caption: "held close", tilt: 1.5 },
  { src: "/gallery/proposal-06.jpg", alt: "Tears of joy", tilt: -1 },
  { src: "/gallery/prewedding-01.jpg", alt: "Portrait no. 1", tilt: 0.5 },
  { src: "/gallery/proposal-10.jpg", alt: "In his arms", caption: "yes, forever", tilt: -1.5 },
  { src: "/gallery/prewedding-02.jpg", alt: "Portrait no. 2", tilt: 1 },
  { src: "/gallery/proposal-11.jpg", alt: "Ring reveal", tilt: -0.5 },
  { src: "/gallery/prewedding-03.jpg", alt: "Portrait no. 3", caption: "the look", tilt: 1.5 },
  { src: "/gallery/proposal-12.jpg", alt: "The proposal scene", caption: "everything changed", tilt: -1 },
  { src: "/gallery/prewedding-04.jpg", alt: "Portrait no. 4", tilt: 0.5 },
  { src: "/gallery/prewedding-08.jpg", alt: "Portrait no. 8", tilt: -1.5 },
  { src: "/gallery/prewedding-19.jpg", alt: "Portrait no. 19", caption: "the day we chose forever", tilt: 1 },
  { src: "/gallery/couple-02.jpg", alt: "Tender moment", tilt: -0.5 },
  { src: "/gallery/prewedding-07.jpg", alt: "Portrait no. 7", caption: "home", tilt: 1.5 },
  { src: "/gallery/prewedding-13.jpg", alt: "Portrait no. 13", tilt: -1 },
  { src: "/gallery/couple-04.jpg", alt: "Intimate portrait", caption: "us", tilt: 0.5 },
  { src: "/gallery/prewedding-10.jpg", alt: "Portrait no. 10", tilt: -1.5 },
  { src: "/gallery/prewedding-11.jpg", alt: "Portrait no. 11", caption: "together", tilt: 1 },
  { src: "/gallery/prewedding-06.jpg", alt: "Portrait no. 6", tilt: -0.5 },
  { src: "/gallery/prewedding-16.jpg", alt: "Portrait no. 16", tilt: 1.5 },
  { src: "/gallery/prewedding-18.jpg", alt: "Portrait no. 18", caption: "tenderness", tilt: -1 },
  { src: "/gallery/couple-06.jpg", alt: "Together", tilt: 0.5 },
];

/**
 * Gallery — a Pinterest-style masonry. Each photo renders at its natural
 * aspect ratio inside a wavy-textured polaroid frame. Captions on some
 * tiles break row alignment further. This scene can exceed 100vh; its
 * own scroll container handles overflow while the shared blue backdrop
 * stays anchored.
 */
export default function GalleryScene({
  footer,
}: {
  /** Slot rendered at the end of the scrollable content (prev/next nav). */
  footer?: ReactNode;
} = {}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-gallery-tile]",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          stagger: 0.015,
          delay: 0.1,
        },
      );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative z-[1] h-screen overflow-y-auto overflow-x-hidden px-5 md:px-10 pt-24 pb-36 no-scrollbar"
    >
      <div className="relative max-w-6xl mx-auto">
        <div className="mb-10 md:mb-14">
          <SceneHeader
            id="gallery"
            eyebrow="Moments we treasure"
            title="The Gallery"
            subtitle="Every frame of our story so far."
          />
        </div>

        {/* Masonry via CSS columns — intrinsic aspect ratios via plain
            <img>, scattered tilts, wavy-textured polaroid frames with
            optional handwritten captions. */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-5">
          {IMAGES.map((img) => (
            <figure
              key={img.src}
              data-gallery-tile
              style={{ transform: `rotate(${img.tilt ?? 0}deg)` }}
              className={`group relative mb-5 md:mb-6 break-inside-avoid rounded-[3px] polaroid-wavy p-2 md:p-2.5 shadow-[0_14px_34px_-14px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.7)] ring-1 ring-[rgba(60,40,20,0.18)] transition-transform duration-500 hover:!rotate-0 hover:-translate-y-1 ${
                img.caption ? "pb-10 md:pb-12" : "pb-4 md:pb-5"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="block w-full h-auto rounded-[2px] ring-1 ring-black/10"
              />
              {img.caption && (
                <figcaption className="absolute left-0 right-0 bottom-1.5 md:bottom-2 text-center font-script text-ink/80 text-lg md:text-xl leading-none px-3">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>

        {footer}
      </div>
    </section>
  );
}
