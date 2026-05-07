"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
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
// New shots are interleaved at positions that land near the top of each
// CSS column (cols fill top-to-bottom, ~9 items per column at lg breakpoint),
// so all five new images are visible in the first few rows without stacking
// in a single column.
const IMAGES: GalleryImage[] = [
  { src: "/gallery/prewedding-21.jpg", alt: "Standing portrait, hand in hand", caption: "side by side", tilt: -1.5 },
  { src: "/gallery/proposal-01.jpg", alt: "The moment", caption: "the question", tilt: 1 },
  { src: "/gallery/proposal-05.jpg", alt: "Proposal — tears", caption: "her yes", tilt: -0.5 },
  { src: "/gallery/couple-01.jpg", alt: "Embracing warmly", tilt: 1.5 },
  { src: "/gallery/prewedding-22.jpg", alt: "Cheek to cheek, laughing", caption: "us, laughing", tilt: -1 },
  { src: "/gallery/proposal-02.jpg", alt: "Kneeling down", caption: "on one knee", tilt: 0.5 },
  { src: "/gallery/prewedding-17.jpg", alt: "Editorial portrait", tilt: -1.5 },
  { src: "/gallery/proposal-07.jpg", alt: "First embrace", tilt: 1 },
  { src: "/gallery/proposal-03.jpg", alt: "The ring", caption: "sealed", tilt: -0.5 },
  { src: "/gallery/prewedding-23.jpg", alt: "Forehead kiss", caption: "a quiet promise", tilt: 1.5 },
  { src: "/gallery/prewedding-05.jpg", alt: "Golden hour portrait", caption: "that evening light", tilt: -1 },
  { src: "/gallery/proposal-04.jpg", alt: "Surrounded by flowers", tilt: 0.5 },
  { src: "/gallery/couple-03.jpg", alt: "Laughing together", caption: "laughter", tilt: -1.5 },
  { src: "/gallery/proposal-09.jpg", alt: "Whispered words", tilt: 1 },
  { src: "/gallery/prewedding-15.jpg", alt: "Loving embrace", caption: "held close", tilt: -0.5 },
  { src: "/gallery/proposal-06.jpg", alt: "Tears of joy", tilt: 1.5 },
  { src: "/gallery/prewedding-01.jpg", alt: "Portrait no. 1", tilt: -1 },
  { src: "/gallery/prewedding-24.jpg", alt: "Warm embrace, looking forward", caption: "yours, always", tilt: 0.5 },
  { src: "/gallery/proposal-10.jpg", alt: "In his arms", caption: "yes, forever", tilt: -1.5 },
  { src: "/gallery/prewedding-02.jpg", alt: "Portrait no. 2", tilt: 1 },
  { src: "/gallery/proposal-11.jpg", alt: "Ring reveal", tilt: -0.5 },
  { src: "/gallery/prewedding-03.jpg", alt: "Portrait no. 3", caption: "the look", tilt: 1.5 },
  { src: "/gallery/proposal-12.jpg", alt: "The proposal scene", caption: "everything changed", tilt: -1 },
  { src: "/gallery/prewedding-04.jpg", alt: "Portrait no. 4", tilt: 0.5 },
  { src: "/gallery/prewedding-08.jpg", alt: "Portrait no. 8", tilt: -1.5 },
  { src: "/gallery/couple-02.jpg", alt: "Tender moment", tilt: -0.5 },
  { src: "/gallery/prewedding-25.jpg", alt: "Held from behind, smiling", caption: "safe in his arms", tilt: 1.5 },
  { src: "/gallery/prewedding-07.jpg", alt: "Portrait no. 7", caption: "home", tilt: -1 },
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = (i: number) => setActiveIndex(i);
  const close = () => setActiveIndex(null);
  const next = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % IMAGES.length));
  const prev = () =>
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + IMAGES.length) % IMAGES.length,
    );

  // Lock body scroll + bind keyboard nav while the lightbox is open.
  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex]);

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
          {IMAGES.map((img, i) => (
            <figure
              key={img.src}
              data-gallery-tile
              role="button"
              tabIndex={0}
              aria-label={`Open ${img.alt} in lightbox`}
              onClick={() => open(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open(i);
                }
              }}
              style={{ transform: `rotate(${img.tilt ?? 0}deg)` }}
              className={`group relative mb-5 md:mb-6 break-inside-avoid rounded-[3px] polaroid-wavy p-2 md:p-2.5 shadow-[0_14px_34px_-14px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.7)] ring-1 ring-[rgba(60,40,20,0.18)] cursor-pointer outline-none transition-transform duration-500 hover:!rotate-0 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-gold ${
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

      {activeIndex !== null && typeof document !== "undefined" &&
        createPortal(
          <Lightbox
            image={IMAGES[activeIndex]!}
            index={activeIndex}
            total={IMAGES.length}
            onClose={close}
            onNext={next}
            onPrev={prev}
          />,
          document.body,
        )}
    </section>
  );
}

function Lightbox({
  image,
  index,
  total,
  onClose,
  onNext,
  onPrev,
}: {
  image: GalleryImage;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm animate-[lightboxIn_180ms_ease-out]"
    >
      <style>{`@keyframes lightboxIn { from { opacity: 0 } to { opacity: 1 } }`}</style>

      {/* Close */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white/85 hover:bg-black/60 hover:text-white hover:border-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Prev */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous image"
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white/85 hover:bg-black/60 hover:text-white hover:border-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next image"
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white/85 hover:bg-black/60 hover:text-white hover:border-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Image — clicks inside don't dismiss */}
      <figure
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[95vw] max-h-[88vh] flex flex-col items-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.alt}
          className="block max-w-[95vw] max-h-[80vh] md:max-h-[85vh] w-auto h-auto object-contain rounded-sm shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
        />
        {image.caption && (
          <figcaption className="mt-4 text-center font-script text-gold-light/90 text-2xl md:text-3xl leading-none">
            {image.caption}
          </figcaption>
        )}
      </figure>

      {/* Counter */}
      <p
        aria-live="polite"
        className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 font-sans text-[11px] tracking-[0.4em] uppercase text-white/65 tabular-nums"
      >
        {index + 1} / {total}
      </p>
    </div>
  );
}
