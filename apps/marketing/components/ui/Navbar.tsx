"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { COUPLE, NAV_LINKS } from "@/lib/constants";
import Ornament from "@/components/ui/Ornament";

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
            ? "bg-ivory/90 backdrop-blur-md shadow-[0_1px_0_rgba(168,180,196,0.25)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
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

          <ul className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`group relative font-sans text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 hover:text-gold ${
                    scrolled ? "text-royal-700" : "text-white/70"
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-[width] duration-500 ease-out group-hover:w-full" />
                </a>
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
                  ? "border-royal/25 bg-white/70 backdrop-blur-sm hover:border-royal hover:bg-white"
                  : "border-white/25 bg-black/20 backdrop-blur-md hover:border-gold/60 hover:bg-black/30"
            }`}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-full origin-center transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  mobileOpen
                    ? "translate-y-[7px] rotate-45 bg-gold"
                    : scrolled
                      ? "bg-royal"
                      : "bg-white/85"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-px transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  mobileOpen
                    ? "w-0 opacity-0"
                    : scrolled
                      ? "w-2/3 bg-royal group-hover:w-full"
                      : "w-2/3 bg-gold-light group-hover:w-full"
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-px w-full origin-center transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  mobileOpen
                    ? "-translate-y-[7px] -rotate-45 bg-gold"
                    : scrolled
                      ? "bg-royal"
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
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#041d4a] via-royal-dark to-[#082a66]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.12)_0%,_transparent_60%)]" />
        {/* Watermark monogram */}
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
            className="w-[85%] max-w-[420px] aspect-square rounded-full object-cover opacity-[0.06] blur-sm"
            aria-hidden
          />
        </div>

        {/* Content */}
        <div className="relative z-[1] h-full flex flex-col px-8 pt-24 pb-10">
          {/* Eyebrow */}
          <div
            className={`text-center transition-all duration-700 ${
              mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
            }`}
            style={{ transitionDelay: mobileOpen ? "180ms" : "0ms" }}
          >
            <p className="font-sans text-[9px] tracking-[0.55em] uppercase text-gold-light/75">
              A Royal Celebration
            </p>
            <p className="mt-3 font-serif italic text-gold-light/90 text-lg leading-tight">
              {COUPLE.partner1.split(" ")[0]} &nbsp;&amp;&nbsp;{" "}
              {COUPLE.partner2.split(" ")[0]}
            </p>
          </div>

          {/* Nav links — stagger up */}
          <ul className="flex-1 flex flex-col items-center justify-center gap-5">
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
                    ? `${260 + i * 90}ms`
                    : "0ms",
                }}
              >
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="group relative block font-serif text-4xl leading-none text-white/90 tracking-[0.02em] transition-colors duration-300 hover:text-gold-light"
                >
                  <span className="absolute -left-6 top-1/2 -translate-y-1/2 font-sans text-[9px] tracking-[0.35em] uppercase text-gold/60 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                  <span className="absolute -bottom-2 left-0 h-px w-0 bg-gradient-to-r from-gold/70 to-transparent transition-[width] duration-500 ease-out group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* Footer flourish */}
          <div
            className={`mt-auto flex flex-col items-center gap-4 transition-all duration-700 ${
              mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDelay: mobileOpen ? `${260 + NAV_LINKS.length * 90 + 80}ms` : "0ms",
            }}
          >
            <div className="text-gold">
              <Ornament variant="diamond" className="w-28" />
            </div>
            <p className="font-serif italic text-gold-light/80 text-lg tracking-[0.2em] tabular-nums">
              20 · 06 · 26
            </p>
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold-light/40">
              {COUPLE.hashtag}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
