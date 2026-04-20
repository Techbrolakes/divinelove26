"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { COUPLE, NAV_LINKS } from "@/lib/constants";
import Ornament from "@/components/ui/ornament";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-royal-dark/85 backdrop-blur-md border-b border-gold/15 md:bg-ivory/90 md:border-0 md:shadow-[0_1px_0_rgba(168,180,196,0.25)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Mobile: always white-on-blue (reads on transparent and royal-dark) */}
            <Image
              src="/logo/monogram-white-on-blue.jpeg"
              alt="Divine Love 26"
              width={40}
              height={40}
              className="md:hidden rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            {/* Desktop: swap variant with scroll state */}
            <Image
              src={
                scrolled
                  ? "/logo/monogram-blue-on-white.jpeg"
                  : "/logo/monogram-white-on-blue.jpeg"
              }
              alt="Divine Love 26"
              width={40}
              height={40}
              className="hidden md:block rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <span
              className={`hidden md:block font-serif text-sm tracking-[0.15em] transition-colors duration-500 ${
                scrolled ? "text-royal" : "text-white/70"
              }`}
            >
              Divine Love
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group relative font-sans text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 hover:text-gold ${
                    scrolled ? "text-royal-700" : "text-white/70"
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-[width] duration-500 ease-out group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Upgraded hamburger — circular, gold-ringed, with animated lines */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className={`md:hidden group relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
              mobileOpen
                ? "border-gold/60 bg-royal-dark/80 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                : scrolled
                  ? "border-gold/30 bg-royal-dark/50 backdrop-blur-sm hover:border-gold hover:bg-royal-dark/80"
                  : "border-white/25 bg-black/20 backdrop-blur-md hover:border-gold/60 hover:bg-black/30"
            }`}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-full origin-center transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  mobileOpen
                    ? "translate-y-[7px] rotate-45 bg-gold"
                    : scrolled
                      ? "bg-gold-light"
                      : "bg-white/85"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-px transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  mobileOpen
                    ? "w-0 opacity-0"
                    : "w-2/3 bg-gold-light group-hover:w-full"
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-px w-full origin-center transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  mobileOpen
                    ? "-translate-y-[7px] -rotate-45 bg-gold"
                    : scrolled
                      ? "bg-gold-light"
                      : "bg-white/85"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile overlay — full screen editorial menu */}
      <div
        className={`fixed inset-0 z-[55] md:hidden transition-opacity duration-500 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Background — deep royal, uniformly dark for strong readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020823] via-[#04123a] to-[#050f2e]" />
        {/* Faint diamond lattice */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Soft monogram watermark */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-[1200ms] ease-out ${
            mobileOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <Image
            src="/logo/monogram-white-on-blue.jpeg"
            alt=""
            width={500}
            height={500}
            className="w-[90%] max-w-[460px] aspect-square rounded-full object-cover opacity-[0.05] blur-sm"
            aria-hidden
          />
        </div>

        {/* Prominent CLOSE button — top-right, clearly labelled */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className={`absolute top-5 right-5 z-[2] inline-flex items-center gap-2 rounded-full border border-gold/50 bg-royal-dark/70 backdrop-blur-md pl-4 pr-2 py-2 text-gold-light transition-all duration-500 hover:border-gold hover:text-white hover:bg-royal-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
            mobileOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2"
          }`}
          style={{ transitionDelay: mobileOpen ? "100ms" : "0ms" }}
        >
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase">
            Close
          </span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold/90 text-royal-dark">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </span>
        </button>

        {/* Content */}
        <div className="relative z-[1] h-full flex flex-col px-6 pt-20 pb-10">
          {/* Eyebrow */}
          <div
            className={`text-center transition-all duration-700 ${
              mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
            }`}
            style={{ transitionDelay: mobileOpen ? "180ms" : "0ms" }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
              <p className="font-sans text-[9px] tracking-[0.55em] uppercase text-gold-light/80">
                A Royal Celebration
              </p>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <p className="mt-4 font-serif italic text-white text-2xl leading-tight tracking-wide">
              {COUPLE.partner1.split(" ")[0]}
              <span className="font-script text-gold mx-3 text-3xl">&amp;</span>
              {COUPLE.partner2.split(" ")[0]}
            </p>
            <p className="mt-2 font-serif italic text-gold-light/70 text-sm tracking-[0.25em] tabular-nums">
              20 · 06 · 26
            </p>
          </div>

          {/* Nav links */}
          <ul className="flex-1 flex flex-col items-stretch justify-center gap-2.5 mt-8">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.href}
                className={`transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                  mobileOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: mobileOpen
                    ? `${260 + i * 80}ms`
                    : "0ms",
                }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="group relative flex items-center justify-between rounded-sm border border-gold/20 bg-white/[0.03] backdrop-blur-sm px-5 py-4 transition-all duration-500 hover:border-gold/60 hover:bg-white/[0.06] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                >
                  <span className="flex items-center gap-4">
                    <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-gold/70 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-2xl text-white/95 tracking-wide">
                      {link.label}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 text-gold-light/80 transition-all duration-500 group-hover:translate-x-1 group-hover:border-gold group-hover:text-white group-hover:bg-gold/20"
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer flourish */}
          <div
            className={`mt-6 flex flex-col items-center gap-3 transition-all duration-700 ${
              mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDelay: mobileOpen ? `${260 + NAV_LINKS.length * 80 + 80}ms` : "0ms",
            }}
          >
            <div className="text-gold/70">
              <Ornament variant="diamond" className="w-28" />
            </div>
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold-light/50">
              {COUPLE.hashtag}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
