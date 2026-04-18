"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/ui/section-wrapper";
import SplitReveal from "@/components/ui/split-reveal";
import Lightbox from "@/components/ui/lightbox";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  ratio?: string;
};

// Curated editorial spread — 6 featured images, asymmetric hierarchy.
const FEATURED_IMAGES: GalleryImage[] = [
  {
    src: "/gallery/prewedding-09.jpg",
    alt: "Traditional attire portrait",
    caption: "Dressed in heritage, draped in love",
  },
  {
    src: "/gallery/couple-01.jpg",
    alt: "Couple embracing warmly",
    caption: "Every day begins with you",
  },
  {
    src: "/gallery/prewedding-17.jpg",
    alt: "Editorial portrait",
    caption: "Where our story quietly continues",
  },
  {
    src: "/gallery/prewedding-14.jpg",
    alt: "Intimate pose",
    caption: "A look that says everything",
  },
  {
    src: "/gallery/prewedding-15.jpg",
    alt: "Loving embrace",
    caption: "Held close, always",
  },
  {
    src: "/gallery/prewedding-20.jpg",
    alt: "Together in the light",
    caption: "Walking into forever",
  },
];

// Classes per tile define the editorial hierarchy (desktop only; mobile stacks).
const EDITORIAL_LAYOUT = [
  "md:col-span-7 md:row-span-2 aspect-[3/4] md:aspect-auto",
  "md:col-span-5 md:row-span-1 aspect-[4/3] md:aspect-auto",
  "md:col-span-5 md:row-span-1 aspect-[4/3] md:aspect-auto",
  "md:col-span-5 md:row-span-1 aspect-[4/3] md:aspect-auto",
  "md:col-span-3 md:row-span-1 aspect-[3/4] md:aspect-auto",
  "md:col-span-4 md:row-span-1 aspect-[4/3] md:aspect-auto",
];

const ALL_IMAGES: GalleryImage[] = [
  ...FEATURED_IMAGES,
  { src: "/gallery/prewedding-05.jpg", alt: "Golden hour portrait" },
  { src: "/gallery/couple-03.jpg", alt: "Laughing together" },
  { src: "/gallery/prewedding-01.jpg", alt: "Portrait no. 1" },
  { src: "/gallery/prewedding-02.jpg", alt: "Portrait no. 2" },
  { src: "/gallery/prewedding-03.jpg", alt: "Portrait no. 3" },
  { src: "/gallery/prewedding-04.jpg", alt: "Portrait no. 4" },
  { src: "/gallery/prewedding-06.jpg", alt: "Portrait no. 6" },
  { src: "/gallery/prewedding-07.jpg", alt: "Portrait no. 7" },
  { src: "/gallery/prewedding-08.jpg", alt: "Portrait no. 8" },
  { src: "/gallery/prewedding-10.jpg", alt: "Portrait no. 10" },
  { src: "/gallery/prewedding-11.jpg", alt: "Portrait no. 11" },
  { src: "/gallery/prewedding-13.jpg", alt: "Portrait no. 13" },
  { src: "/gallery/prewedding-14.jpg", alt: "Portrait no. 14" },
  { src: "/gallery/prewedding-15.jpg", alt: "Portrait no. 15" },
  { src: "/gallery/prewedding-16.jpg", alt: "Portrait no. 16" },
  { src: "/gallery/prewedding-18.jpg", alt: "Portrait no. 18" },
  { src: "/gallery/prewedding-19.jpg", alt: "Portrait no. 19" },
  { src: "/gallery/couple-02.jpg", alt: "Tender moment" },
  { src: "/gallery/couple-04.jpg", alt: "Intimate couple portrait" },
  { src: "/gallery/couple-06.jpg", alt: "Together" },
];

export default function Gallery() {
  const scope = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + ALL_IMAGES.length) % ALL_IMAGES.length : null,
    );
  const nextImage = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % ALL_IMAGES.length : null));

  useGSAP(
    () => {
      gsap.set("[data-gallery-label] [data-char]", { y: "100%" });
      gsap.set("[data-gallery-title] [data-char]", { y: "100%" });

      gsap.to("[data-gallery-label] [data-char]", {
        y: 0,
        duration: 0.9,
        stagger: 0.015,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-gallery-label]",
          start: "top 85%",
        },
      });

      gsap.to("[data-gallery-title] [data-char]", {
        y: 0,
        duration: 1.1,
        stagger: 0.022,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-gallery-title]",
          start: "top 85%",
        },
      });

      gsap.fromTo(
        "[data-gallery-count]",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-gallery-count]",
            start: "top 92%",
          },
        },
      );

      const tiles = gsap.utils.toArray<HTMLElement>("[data-gallery-tile]");
      tiles.forEach((tile, i) => {
        gsap.fromTo(
          tile,
          {
            clipPath: "inset(100% 0% 0% 0%)",
            opacity: 0,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            delay: (i % 4) * 0.06,
            scrollTrigger: {
              trigger: tile,
              start: "top 94%",
            },
          },
        );
      });

      gsap.fromTo(
        "[data-gallery-cta]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-gallery-cta]",
            start: "top 95%",
          },
        },
      );
    },
    { scope },
  );

  void ScrollTrigger;

  return (
    <SectionWrapper id="gallery" className="bg-white relative noise-overlay">
      <div ref={scope} className="relative z-[2] max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <SplitReveal
            text="Moments we treasure"
            as="p"
            data-gallery-label
            className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold-dark mb-4"
          />
          <SplitReveal
            text="Gallery"
            as="h2"
            data-gallery-title
            className="font-serif text-5xl md:text-7xl font-light text-royal tracking-[0.02em]"
          />
          <div className="h-px w-16 bg-gold mx-auto mt-6" />
        </div>

        {/* Editorial spread — asymmetric 12-col grid, 6 curated images */}
        <div className="grid md:grid-cols-12 md:auto-rows-[220px] lg:auto-rows-[260px] gap-3 md:gap-4">
          {FEATURED_IMAGES.map((image, index) => (
            <button
              type="button"
              key={image.src}
              data-gallery-tile
              onClick={() => openLightbox(index)}
              aria-label={`Open ${image.alt}`}
              className={`relative block w-full overflow-hidden rounded-[2px] cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal/60 focus-visible:ring-offset-2 ${
                EDITORIAL_LAYOUT[index] ?? "aspect-[4/5]"
              }`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
                  quality={90}
                />
              </div>

              <div className="absolute inset-0 bg-royal/0 transition-colors duration-500 group-hover:bg-royal/20" />
              <div className="absolute inset-[10px] border border-white/0 transition-all duration-500 group-hover:border-white/30 rounded-[2px]" />
              <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-gold/0 transition-all duration-500 group-hover:border-gold/70" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-gold/0 transition-all duration-500 group-hover:border-gold/70" />

              <span className="absolute top-3 right-3 font-sans text-[9px] tracking-[0.35em] uppercase text-transparent backdrop-blur-md bg-black/0 border border-white/0 rounded-full px-2.5 py-1 transition-all duration-500 group-hover:text-gold-light group-hover:bg-black/40 group-hover:border-gold/40">
                {String(index + 1).padStart(2, "0")}
              </span>

              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black/75 via-black/35 to-transparent">
                  <p className="font-serif italic text-white text-sm md:text-base leading-snug">
                    {image.caption}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* View all CTA */}
        <div
          data-gallery-cta
          className="mt-10 md:mt-14 flex flex-col items-center gap-3 opacity-0"
        >
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="group inline-flex items-center gap-4 rounded-full border border-royal/25 bg-white px-8 py-3.5 font-sans text-[10px] tracking-[0.4em] uppercase text-royal shadow-[0_8px_30px_rgba(11,61,145,0.08)] transition-all duration-500 hover:border-royal hover:shadow-[0_14px_40px_rgba(11,61,145,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal/60"
          >
            <span className="h-px w-5 bg-royal/60 transition-all duration-500 group-hover:w-8 group-hover:bg-gold" />
            View the full slideshow
            <span className="tabular-nums text-gold-dark">
              ({ALL_IMAGES.length})
            </span>
          </button>
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold-dark/70">
            Tap any photograph to open
          </p>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={ALL_IMAGES}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
          onSelect={(i) => setLightboxIndex(i)}
        />
      )}
    </SectionWrapper>
  );
}
