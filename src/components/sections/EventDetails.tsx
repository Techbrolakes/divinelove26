"use client";

import SectionWrapper from "@/components/ui/SectionWrapper";
import { motion } from "framer-motion";

const EVENTS = [
  {
    name: "Wedding Ceremony",
    date: "June 20, 2026",
    time: "2:00 PM",
    venue: "Venue Name",
    address: "123 Beautiful Street, City, State",
    dressCode: "Formal Attire",
    description:
      "Join us as we exchange vows and begin our journey together as one.",
  },
  {
    name: "Reception",
    date: "June 20, 2026",
    time: "5:00 PM",
    venue: "Reception Venue",
    address: "456 Celebration Avenue, City, State",
    dressCode: "Formal Attire",
    description:
      "Dinner, dancing, and celebration. We can't wait to share this joyous evening with you.",
  },
];

function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 40 L0 15 Q0 0 15 0 L40 0"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
      <path
        d="M0 40 L0 20 Q0 5 15 5 L40 5"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.5"
        fill="none"
      />
    </svg>
  );
}

export default function EventDetails() {
  return (
    <SectionWrapper
      id="events"
      className="relative bg-gradient-to-b from-ivory via-cream to-ivory noise-overlay"
    >
      <div className="relative z-[2] max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-4"
          >
            Join us to celebrate
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-light text-royal tracking-wide"
          >
            Event Details
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-px bg-gold mx-auto mt-6"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {EVENTS.map((event, index) => (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className="relative bg-white rounded-sm p-10 md:p-12 card-emboss stationery-border group"
            >
              {/* Corner ornaments */}
              <CornerOrnament className="absolute top-2 left-2 w-8 h-8 text-gold/30" />
              <CornerOrnament className="absolute top-2 right-2 w-8 h-8 text-gold/30 -scale-x-100" />
              <CornerOrnament className="absolute bottom-2 left-2 w-8 h-8 text-gold/30 -scale-y-100" />
              <CornerOrnament className="absolute bottom-2 right-2 w-8 h-8 text-gold/30 scale-[-1]" />

              <div className="relative text-center">
                {/* Event name */}
                <h3 className="font-serif text-2xl md:text-3xl text-royal mb-1 font-light">
                  {event.name}
                </h3>

                <div className="flex items-center justify-center gap-3 my-5">
                  <span className="h-px w-8 bg-gold/30" />
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold/50" />
                  <span className="h-px w-8 bg-gold/30" />
                </div>

                {/* Date & time — large serif */}
                <p className="font-serif text-lg md:text-xl text-royal-600 italic mb-1">
                  {event.date}
                </p>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-8">
                  {event.time}
                </p>

                {/* Venue info */}
                <div className="space-y-2 mb-8">
                  <p className="font-serif text-base text-royal-700">
                    {event.venue}
                  </p>
                  <p className="font-sans text-xs text-warm-400 tracking-wide">
                    {event.address}
                  </p>
                </div>

                {/* Description */}
                <p className="font-sans text-sm text-warm-500 leading-[1.8] mb-8 max-w-xs mx-auto">
                  {event.description}
                </p>

                {/* Dress code badge */}
                <div className="inline-flex items-center gap-2 border border-gold/20 px-5 py-2.5 rounded-sm">
                  <svg
                    className="w-3.5 h-3.5 text-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                  <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-royal-600">
                    {event.dressCode}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
