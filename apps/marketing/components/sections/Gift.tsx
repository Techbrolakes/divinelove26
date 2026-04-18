"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import SplitReveal from "@/components/ui/SplitReveal";
import {
  GIFT_ACCOUNTS,
  GIFT_BACKDROP,
  GIFT_ESPEES_HANDLE,
} from "@/lib/constants";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

type AccountEntry = {
  key: string;
  label: string;
  primary: string;
  secondary?: string;
  tertiary?: string;
  copyValue: string;
};

export default function Gift() {
  const scope = useRef<HTMLElement>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 2200);
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
    ...GIFT_ACCOUNTS.map((account, i) => ({
      key: `bank-${i}`,
      label: account.bank,
      primary: account.number,
      secondary: account.label,
      tertiary: account.name,
      copyValue: account.number,
    })),
  ];

  useGSAP(
    () => {
      gsap.set("[data-gift-label] [data-char]", { y: "100%" });
      gsap.set("[data-gift-title] [data-char]", { y: "100%" });

      gsap.to("[data-gift-label] [data-char]", {
        y: 0,
        duration: 0.8,
        stagger: 0.014,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-gift-label]", start: "top 88%" },
      });

      gsap.to("[data-gift-title] [data-char]", {
        y: 0,
        duration: 1,
        stagger: 0.02,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-gift-title]", start: "top 88%" },
      });

      gsap.utils
        .toArray<HTMLElement>("[data-gift-account]")
        .forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "expo.out",
              delay: i * 0.08,
              scrollTrigger: { trigger: el, start: "top 92%" },
            },
          );
        });

      gsap.fromTo(
        "[data-gift-backdrop]",
        { scale: 1.08, yPercent: 0 },
        {
          scale: 1.16,
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-gift-backdrop]",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        },
      );
    },
    { scope },
  );

  void ScrollTrigger;

  return (
    <section
      ref={scope}
      id="gift"
      className="relative overflow-hidden py-20 md:py-28 px-6"
    >
      <div
        data-gift-backdrop
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={GIFT_BACKDROP}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          quality={80}
          aria-hidden="true"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-royal-dark/95 via-royal/92 to-royal-dark/97" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,180,196,0.12)_0%,_transparent_60%)]" />

      <div className="relative z-[2] max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <SplitReveal
            text="A note on gifts"
            as="p"
            data-gift-label
            className="font-sans text-[10px] tracking-[0.55em] uppercase text-gold-light/70 mb-4"
          />
          <SplitReveal
            text="With Gratitude"
            as="h2"
            data-gift-title
            className="font-serif text-4xl md:text-5xl font-light text-white tracking-[0.02em]"
          />
          <p className="mt-5 font-serif italic text-lg md:text-xl text-gold-light/85 max-w-xl mx-auto leading-[1.45]">
            Your presence is the greatest gift of all — any further kindness
            may be sent through the channels below.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {accounts.map((account) => (
            <AccountCard
              key={account.key}
              entry={account}
              copied={copiedKey === account.key}
              onCopy={() => copy(account.copyValue, account.key)}
            />
          ))}
        </div>

        <p className="mt-10 text-center font-sans text-[10px] tracking-[0.5em] uppercase text-gold-light/45">
          Thank you · Divine &amp; Love
        </p>
      </div>
    </section>
  );
}

function AccountCard({
  entry,
  copied,
  onCopy,
}: {
  entry: AccountEntry;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div
      data-gift-account
      className="relative flex flex-col rounded-sm border border-gold/30 bg-white/[0.04] backdrop-blur-md p-5 md:p-6 opacity-0"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold-light/70">
          {entry.label}
        </p>
        {entry.secondary && (
          <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/40">
            {entry.secondary}
          </p>
        )}
      </div>

      <p className="mt-4 font-serif text-xl md:text-2xl text-white tracking-wide tabular-nums break-all leading-tight">
        {entry.primary}
      </p>

      {entry.tertiary && (
        <p className="mt-2 font-sans text-[13px] text-white/65">
          {entry.tertiary}
        </p>
      )}

      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${entry.label}`}
        className="group mt-5 inline-flex items-center justify-center gap-2 self-start rounded-full border border-gold/40 bg-black/20 px-4 py-1.5 font-sans text-[9px] tracking-[0.4em] uppercase text-gold-light transition-colors duration-300 hover:border-gold hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
      >
        <span
          aria-hidden
          className="inline-flex h-3 w-3 items-center justify-center"
        >
          {copied ? (
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
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
