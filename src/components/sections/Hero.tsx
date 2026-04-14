"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { COUPLE } from "@/lib/constants";

function GoldOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 20"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 10 Q25 0 50 10 Q75 20 100 10 Q125 0 150 10 Q175 20 200 10"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <circle cx="100" cy="10" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="60" cy="10" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="140" cy="10" r="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const sealScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const sealOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden noise-overlay"
    >
      {/* Layered background — paper envelope texture feel */}
      <motion.div className="absolute inset-0" style={{ y }}>
        {/* Deep royal gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#041d4a] via-royal-dark to-royal" />

        {/* Radial glow behind the seal */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.08)_0%,_transparent_60%)]" />

        {/* Subtle diamond crosshatch pattern — like woven linen */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />
      </motion.div>

      {/* Content */}
      <div className="relative z-[2] min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">
        {/* Top ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <GoldOrnament className="w-48 md:w-64 text-gold-light" />
        </motion.div>

        {/* "Save the Date" lettering */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.6em" }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="font-sans text-[10px] md:text-xs uppercase text-gold-light/80 mb-10 md:mb-14"
        >
          Save the Date
        </motion.p>

        {/* Wax seal — the hero centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ scale: sealScale, opacity: sealOpacity }}
          className="relative mb-10 md:mb-14"
        >
          {/* Glow ring behind seal */}
          <div className="absolute -inset-8 md:-inset-12 rounded-full bg-gold/5 blur-2xl" />
          <div className="absolute -inset-4 md:-inset-6 rounded-full bg-gold/8 blur-xl" />

          <Image
            src="/logo/monogram-white-on-blue.jpeg"
            alt="DL Monogram"
            width={200}
            height={200}
            className="relative w-[140px] h-[140px] md:w-[200px] md:h-[200px] rounded-full object-cover shadow-[0_0_60px_rgba(201,168,76,0.12),0_20px_60px_rgba(0,0,0,0.4)] ring-1 ring-white/10"
            priority
          />
        </motion.div>

        {/* Names — large, dramatic serif */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.2 }}
          className="font-serif leading-none"
        >
          <motion.span
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="block text-5xl md:text-7xl lg:text-[5.5rem] font-light text-white tracking-wide"
          >
            {COUPLE.partner1}
          </motion.span>

          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="block my-3 md:my-5"
          >
            <span className="inline-flex items-center gap-4 md:gap-6">
              <span className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="text-2xl md:text-3xl lg:text-4xl font-light italic text-gold gold-shimmer">
                &amp;
              </span>
              <span className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-gold/60" />
            </span>
          </motion.span>

          <motion.span
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="block text-5xl md:text-7xl lg:text-[5.5rem] font-light text-white tracking-wide"
          >
            {COUPLE.partner2}
          </motion.span>
        </motion.h1>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-8 md:mt-10 flex items-center gap-4"
        >
          <span className="h-px w-8 bg-white/20" />
          <p className="font-serif text-lg md:text-xl text-white/60 italic tracking-wide">
            20th June, 2026
          </p>
          <span className="h-px w-8 bg-white/20" />
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 1 }}
          className="mt-12 md:mt-16"
        >
          <CountdownTimer />
        </motion.div>

        {/* Hashtag */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="font-sans text-[10px] tracking-[0.4em] text-gold-light/40 mt-10"
        >
          {COUPLE.hashtag}
        </motion.p>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1 }}
          className="mt-8"
        >
          <GoldOrnament className="w-32 text-gold-light/30" />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 1 }}
          className="absolute bottom-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-white/25">
              Scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
