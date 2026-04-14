"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-ivory/90 backdrop-blur-md shadow-[0_1px_0_rgba(201,168,76,0.15)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <Image
            src={
              scrolled
                ? "/logo/monogram-blue-on-white.jpeg"
                : "/logo/monogram-white-on-blue.jpeg"
            }
            alt="Divine Love 26"
            width={40}
            height={40}
            className="rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <span
            className={`hidden md:block font-serif text-sm tracking-[0.15em] transition-colors duration-500 ${
              scrolled ? "text-royal" : "text-white/70"
            }`}
          >
            Divine Love
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`relative font-sans text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 hover:text-gold ${
                  scrolled ? "text-royal-700" : "text-white/70"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
          <li>
            <a
              href="#rsvp"
              className={`font-sans text-[11px] font-medium tracking-[0.2em] uppercase px-5 py-2 rounded-sm border transition-all duration-300 ${
                scrolled
                  ? "border-royal text-royal hover:bg-royal hover:text-white"
                  : "border-gold/40 text-gold-light hover:bg-gold/10"
              }`}
            >
              RSVP
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block w-5 h-px transition-all duration-300 ${
                scrolled ? "bg-royal" : "bg-white/80"
              } ${
                mobileOpen && i === 0
                  ? "rotate-45 translate-y-[4px]"
                  : mobileOpen && i === 1
                    ? "opacity-0"
                    : mobileOpen && i === 2
                      ? "-rotate-45 -translate-y-[4px]"
                      : ""
              }`}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ivory/95 backdrop-blur-md border-t border-gold/10"
          >
            <ul className="flex flex-col items-center gap-6 py-10">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-royal-700 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
