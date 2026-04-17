"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SplitReveal from "@/components/ui/SplitReveal";
import Lightbox from "@/components/ui/Lightbox";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const GALLERY_IMAGES = [
  { src: "/gallery/couple-01.jpg", alt: "Couple embracing warmly" },
  { src: "/gallery/couple-02.jpg", alt: "Couple sharing a tender moment" },
  { src: "/gallery/couple-03.jpg", alt: "Couple laughing together" },
  { src: "/gallery/couple-04.jpg", alt: "Intimate couple portrait" },
  { src: "/gallery/couple-05.jpg", alt: "Couple in a loving embrace" },
  { src: "/gallery/couple-06.jpg", alt: "Couple sitting together" },
];

const GRID_SPANS = [
  "md:col-span-2 md:row-span-2",
  "",
  "md:row-span-2",
  "",
  "",
  "md:col-span-2",
];

export default function Gallery() {
  const scope = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) =>
      i !== null
        ? (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
        : null,
    );
  const nextImage = () =>
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % GALLERY_IMAGES.length : null,
    );

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

      const tiles = gsap.utils.toArray<HTMLElement>("[data-gallery-tile]");
      tiles.forEach((tile, i) => {
        gsap.fromTo(
          tile,
          {
            clipPath: "inset(100% 0% 0% 0%)",
            scale: 1.08,
            opacity: 0,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            opacity: 1,
            duration: 1.4,
            ease: "expo.out",
            delay: (i % 3) * 0.08,
            scrollTrigger: {
              trigger: tile,
              start: "top 92%",
            },
          },
        );

        const img = tile.querySelector<HTMLElement>("[data-gallery-img]");
        if (img) {
          gsap.to(img, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: tile,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });
    },
    { scope },
  );

  void ScrollTrigger;

  return (
    <SectionWrapper
      id="gallery"
      className="bg-white relative noise-overlay"
    >
      <div ref={scope} className="relative z-[2] max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
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

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[220px] gap-3 md:gap-4">
          {GALLERY_IMAGES.map((image, index) => (
            <div
              key={image.src}
              data-gallery-tile
              className={`relative overflow-hidden rounded-sm cursor-pointer group will-change-transform ${
                GRID_SPANS[index] ?? ""
              }`}
              onClick={() => openLightbox(index)}
            >
              <div
                data-gallery-img
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              <div className="absolute inset-0 bg-royal/0 transition-all duration-500 group-hover:bg-royal/20" />
              <div className="absolute inset-3 border border-white/0 transition-all duration-500 group-hover:border-white/30 rounded-sm" />
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold/0 transition-all duration-500 group-hover:border-gold/60" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold/0 transition-all duration-500 group-hover:border-gold/60" />

              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black/55 via-black/20 to-transparent">
                <p className="font-serif italic text-white text-sm md:text-base">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={GALLERY_IMAGES}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </SectionWrapper>
  );
}
