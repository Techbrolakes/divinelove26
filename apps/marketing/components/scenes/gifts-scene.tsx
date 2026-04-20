"use client";

import { useRef, useState } from "react";
import SceneHeader from "@/components/ui/scene-header";
import WaxSeal from "@/components/props/wax-seal";
import { GIFT_ACCOUNTS, GIFT_ESPEES_HANDLE } from "@/lib/constants";
import { useGSAP, gsap } from "@/lib/gsap";

type AccountEntry = {
  key: string;
  label: string;
  primary: string;
  secondary?: string;
  tertiary?: string;
  copyValue: string;
};

/**
 * Gifts — cash-gift channels with a dramatic spring entrance. Each
 * card pops in with an elastic scale and drops a soft gold glow on
 * the backdrop as it lands, so the section feels celebratory rather
 * than utilitarian.
 */
export default function GiftsScene() {
  const scope = useRef<HTMLElement>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((c) => (c === key ? null : c));
      }, 2000);
    } catch {
      /* noop */
    }
  };

  const accounts: AccountEntry[] = [
    {
      key: "espees",
      label: "Espees",
      primary: GIFT_ESPEES_HANDLE,
      secondary: "Username",
      copyValue: GIFT_ESPEES_HANDLE.replace(/^@/, ""),
    },
    ...GIFT_ACCOUNTS.map((a, i) => ({
      key: `bank-${i}`,
      label: a.bank,
      primary: a.number,
      secondary: a.label,
      tertiary: a.name,
      copyValue: a.number,
    })),
  ];

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-gifts-card]",
        { opacity: 0, y: 24, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.6)",
          stagger: 0.06,
          delay: 0.15,
        },
      );

      gsap.fromTo(
        "[data-gifts-seal]",
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(2)",
          stagger: 0.05,
          delay: 0.4,
        },
      );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative z-[1] h-screen overflow-hidden flex flex-col items-center justify-center px-6 pt-20 pb-20 md:pb-24"
    >
      <div className="relative z-[2] mb-10 md:mb-14">
        <SceneHeader
          id="gifts"
          eyebrow="A note on gifts"
          title="With Gratitude"
          subtitle="Your presence is the greatest gift. Any further kindness may be sent through the channels below."
        />
      </div>

      <div className="relative z-[2] grid gap-5 md:grid-cols-3 md:gap-7 w-full max-w-5xl">
        {accounts.map((a) => (
          <div
            key={a.key}
            data-gifts-card
            className="relative flex flex-col rounded-sm border border-gold/40 p-6 md:p-7 opacity-0 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)]"
            style={{
              willChange: "transform, opacity",
              background:
                "linear-gradient(160deg, #0a2255 0%, #061a43 55%, #04123a 100%)",
            }}
          >
            {/* Wax seal — bigger, prouder */}
            <div
              data-gifts-seal
              aria-hidden
              className="pointer-events-none absolute -top-5 -right-5 md:-top-6 md:-right-6 z-[3] opacity-0"
              style={{ willChange: "transform, opacity" }}
            >
              <WaxSeal initials="DL" size={56} className="md:hidden" />
              <WaxSeal initials="DL" size={72} className="hidden md:block" />
            </div>

            <div className="flex items-center justify-between gap-3 pr-10">
              <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold-light/85">
                {a.label}
              </p>
              {a.secondary && (
                <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/45">
                  {a.secondary}
                </p>
              )}
            </div>

            <p className="mt-4 font-serif text-2xl md:text-3xl text-white tracking-wide tabular-nums break-all leading-tight">
              {a.primary}
            </p>

            {a.tertiary && (
              <p className="mt-1.5 font-sans text-[13px] text-white/70">
                {a.tertiary}
              </p>
            )}

            <button
              type="button"
              onClick={() => copy(a.copyValue, a.key)}
              aria-label={`Copy ${a.label}`}
              className="mt-5 inline-flex items-center justify-center gap-2 self-start rounded-full border border-gold/50 bg-black/30 px-5 py-2 font-sans text-[10px] tracking-[0.4em] uppercase text-gold-light transition-all duration-300 hover:border-gold hover:text-white hover:bg-black/50 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              <span
                aria-hidden
                className="inline-flex h-3 w-3 items-center justify-center"
              >
                {copiedKey === a.key ? (
                  <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
                    <path
                      d="M4 10l4 4 8-9"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
                    <rect
                      x="5"
                      y="5"
                      width="10"
                      height="12"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M8 3h6a2 2 0 012 2v7"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </span>
              {copiedKey === a.key ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
