"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Lock } from "lucide-react";

export default function RsvpPage() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center py-16 px-6">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-royal-dark via-[#051538] to-[#010514]" />

      {/* Diamond pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial spotlight */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(26,86,196,0.4) 0%, transparent 60%)",
        }}
      />

      {/* Floating monogram watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <Image
          src="/logo/monogram-white-on-blue.jpeg"
          alt=""
          width={500}
          height={500}
          className="w-[480px] h-[480px] rounded-full opacity-[0.04] blur-[2px]"
          aria-hidden
        />
      </motion.div>

      {/* Decorative corner flourishes */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l border-t border-white/20 rounded-tl-2xl hidden md:block" />
      <div className="absolute top-8 right-8 w-24 h-24 border-r border-t border-white/20 rounded-tr-2xl hidden md:block" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-l border-b border-white/20 rounded-bl-2xl hidden md:block" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r border-b border-white/20 rounded-br-2xl hidden md:block" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="font-sans text-[10px] uppercase text-white/50 mb-5"
          >
            We&apos;re getting married
          </motion.p>

          <h1 className="font-serif italic font-light text-white/95 text-5xl md:text-7xl tracking-tight leading-none">
            Idah
            <span className="inline-block mx-3 text-white/50 text-4xl md:text-5xl">
              &amp;
            </span>
            Ikhioya
          </h1>

          <div className="flex items-center justify-center gap-5 mt-8">
            <span className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="text-white/40 text-2xl">&#10086;</span>
            <span className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          <p className="mt-6 font-sans text-[11px] tracking-[0.4em] uppercase text-white/60">
            20 &middot; June &middot; 2026
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
            {/* Top accent */}
            <div className="absolute inset-x-8 top-0 h-[3px] bg-gradient-to-r from-transparent via-royal to-transparent rounded-full" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-royal to-royal-dark flex items-center justify-center shadow-[0_15px_40px_-10px_rgba(11,61,145,0.5)]"
              >
                <Lock className="w-9 h-9 text-white" strokeWidth={1.5} />
              </motion.div>

              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gray-900 mb-3">
                Registration Closed
              </p>
              <h3 className="font-serif italic text-4xl md:text-5xl text-royal-dark mb-4 font-light">
                Thank you
              </h3>

              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="h-px w-12 bg-gradient-to-r from-transparent via-royal/30 to-transparent" />
                <span className="text-royal/50 text-lg">&#10086;</span>
                <span className="h-px w-12 bg-gradient-to-r from-transparent via-royal/30 to-transparent" />
              </div>

              <p className="font-sans text-[15px] leading-relaxed text-gray-600 max-w-md mx-auto">
                Registration is now closed. Thank you to everyone who
                registered — we can&apos;t wait to celebrate with you.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer hashtag */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center font-sans text-[10px] tracking-[0.4em] uppercase text-white/40 mt-8"
        >
          #DivineLove26
        </motion.p>
      </div>
    </section>
  );
}
