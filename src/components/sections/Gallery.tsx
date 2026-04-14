"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Lightbox from "@/components/ui/Lightbox";

const GALLERY_IMAGES = [
  { src: "/gallery/couple-01.jpg", alt: "Couple embracing warmly" },
  { src: "/gallery/couple-02.jpg", alt: "Couple sharing a tender moment" },
  { src: "/gallery/couple-03.jpg", alt: "Couple laughing together" },
  { src: "/gallery/couple-04.jpg", alt: "Intimate couple portrait" },
  { src: "/gallery/couple-05.jpg", alt: "Couple in a loving embrace" },
  { src: "/gallery/couple-06.jpg", alt: "Couple sitting together" },
];

/* Asymmetric spans for visual interest — tall, wide, normal */
const GRID_SPANS = [
  "md:row-span-2", // tall
  "",               // normal
  "",               // normal
  "",               // normal
  "md:row-span-2", // tall
  "",               // normal
];

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) =>
      i !== null
        ? (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
        : null
    );
  const nextImage = () =>
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % GALLERY_IMAGES.length : null
    );

  return (
    <SectionWrapper id="gallery" className="bg-white relative noise-overlay">
      <div className="relative z-[2] max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-4"
          >
            Moments we treasure
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-light text-royal tracking-wide"
          >
            Gallery
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-px bg-gold mx-auto mt-6"
          />
        </div>

        {/* Asymmetric masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[220px] gap-3 md:gap-4">
          {GALLERY_IMAGES.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className={`relative overflow-hidden rounded-sm cursor-pointer group ${GRID_SPANS[index]}`}
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Hover overlay with subtle gold border inset */}
              <div className="absolute inset-0 bg-royal/0 group-hover:bg-royal/15 transition-all duration-500" />
              <div className="absolute inset-3 border border-white/0 group-hover:border-white/20 transition-all duration-500 rounded-sm" />

              {/* Corner accents on hover */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold/0 group-hover:border-gold/50 transition-all duration-500" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold/0 group-hover:border-gold/50 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={GALLERY_IMAGES}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
