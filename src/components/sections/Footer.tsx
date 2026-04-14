import Image from "next/image";
import { COUPLE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-royal-dark to-[#041d4a] text-white/80 py-20 md:py-28 overflow-hidden noise-overlay">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.04)_0%,_transparent_60%)]" />

      {/* Diamond pattern background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-[2] max-w-4xl mx-auto px-6 text-center">
        <Image
          src="/logo/monogram-white-on-blue.jpeg"
          alt="DL Monogram"
          width={56}
          height={56}
          className="mx-auto rounded-full border border-white/10 mb-8 shadow-[0_0_30px_rgba(201,168,76,0.1)]"
        />

        <h3 className="font-serif text-3xl md:text-4xl font-light text-white mb-3 tracking-wide">
          {COUPLE.partner1} & {COUPLE.partner2}
        </h3>

        <p className="font-serif text-sm text-white/40 italic mb-2">
          20th June, 2026
        </p>

        <div className="flex items-center justify-center gap-3 my-8">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/20" />
          <span className="w-1.5 h-1.5 rotate-45 bg-gold/30" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/20" />
        </div>

        <p className="font-sans text-[10px] tracking-[0.4em] text-gold-light/40 uppercase">
          {COUPLE.hashtag}
        </p>

        <p className="font-sans text-xs text-white/25 mt-12">
          We can&apos;t wait to celebrate with you
        </p>
      </div>
    </footer>
  );
}
