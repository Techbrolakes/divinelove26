"use client";

import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Subtle noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative flex min-h-screen">{children}</div>

      <div className="absolute bottom-0 left-0 right-0 hidden md:flex h-[48px] items-center justify-between border-t border-gray-100 px-12">
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-warm-500">
          Divine Love 26 &middot; Event Admin
        </p>
        <Link
          href="/"
          className="font-sans text-[11px] tracking-[0.3em] uppercase text-warm-500 hover:text-royal transition-colors"
        >
          &larr; Back to RSVP
        </Link>
      </div>
    </div>
  );
}
