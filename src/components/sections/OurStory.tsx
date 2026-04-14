"use client";

import SectionWrapper from "@/components/ui/SectionWrapper";
import { motion } from "framer-motion";

const TIMELINE = [
  {
    date: "January 2020",
    title: "First Meeting",
    description:
      "We met at a mutual friend's gathering and instantly connected over our shared love of adventure.",
  },
  {
    date: "June 2020",
    title: "First Date",
    description:
      "A quiet dinner turned into hours of conversation. We knew something special was beginning.",
  },
  {
    date: "December 2022",
    title: "The Proposal",
    description:
      "Under a canopy of stars, the question was asked, and without hesitation, the answer was yes.",
  },
  {
    date: "June 2026",
    title: "The Wedding",
    description:
      "And now we invite you to celebrate the beginning of our forever with us.",
  },
];

function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 12 Q15 4 30 12 Q45 20 60 12 Q75 4 90 12 Q105 20 120 12"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <circle cx="60" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export default function OurStory() {
  return (
    <SectionWrapper id="story" className="bg-white relative noise-overlay">
      <div className="relative z-[2] max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20 md:mb-28">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-4"
          >
            How it all began
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-light text-royal tracking-wide"
          >
            Our Story
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Flourish className="w-28 text-gold mx-auto mt-6" />
          </motion.div>
        </div>

        {/* Editorial timeline */}
        <div className="relative">
          {/* Vertical thread — thin gold line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

          {TIMELINE.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className={`relative flex items-start mb-20 md:mb-28 last:mb-0 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline node — gold diamond */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                  <div className="w-3 h-3 rotate-45 bg-gold/80 shadow-[0_0_12px_rgba(201,168,76,0.3)]" />
                </div>

                {/* Content card */}
                <div
                  className={`ml-16 md:ml-0 md:w-[calc(50%-3rem)] ${
                    isEven ? "md:pr-0 md:text-right" : "md:pl-0 md:text-left"
                  }`}
                >
                  {/* Large decorative date */}
                  <span className="font-serif text-[10px] md:text-xs tracking-[0.4em] uppercase text-gold/70">
                    {item.date}
                  </span>

                  <h3 className="font-serif text-2xl md:text-3xl text-royal mt-3 mb-4 font-light">
                    {item.title}
                  </h3>

                  <div
                    className={`w-10 h-px bg-gold/30 mb-4 ${
                      isEven ? "md:ml-auto" : ""
                    }`}
                  />

                  <p className="font-sans text-sm text-warm-500 leading-[1.8] max-w-sm md:max-w-none">
                    {item.description}
                  </p>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block md:w-[calc(50%-3rem)]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
