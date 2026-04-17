"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen((v) => !v)}
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

      <div
        className={`md:hidden grid transition-[grid-template-rows] duration-500 ease-out ${
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-ivory/95 backdrop-blur-md border-t border-gold/10">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
