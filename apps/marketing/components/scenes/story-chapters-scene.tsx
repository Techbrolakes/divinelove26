"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import SplitReveal from "@/components/ui/split-reveal";
import Ornament from "@/components/ui/ornament";
import DropCap from "@/components/props/drop-cap";
import VideoFrame from "@/components/props/video-frame";
import PaperCard from "@/components/props/paper-card";
import { STORY_PHOTOS } from "@/lib/constants";
import { HERO_VIDEO } from "@/lib/scenes";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Scene 4 — Our Story chapters.
 *
 * Four prose pages of the couple's story, rendered as stacked letter
 * pages on aged parchment with ornamental script drop-caps, torn-paper
 * photo insets, and a silent B-roll interstitial after chapter II.
 * Ambient music ducks while the user is reading this scene.
 */

interface Chapter {
  number: string;
  date: string;
  title: string;
  lead: string;
  body: string;
  photo: string;
  photoAlt: string;
  /** Photo on the left (L) or right (R) of the text. */
  layout: "L" | "R";
}

const CHAPTERS: Chapter[] = [
  {
    number: "I",
    date: "January 2020",
    title: "How it began",
    lead:
      "A single, ordinary evening — and the beginning of every evening that came after.",
    body:
      "We met at a mutual friend's gathering over borrowed chairs and easy laughter. Neither of us guessed that the night would become the prologue to a life.",
    photo: STORY_PHOTOS[0] ?? "/gallery/prewedding-01.jpg",
    photoAlt: "First meeting",
    layout: "L",
  },
  {
    number: "II",
    date: "June 2020",
    title: "A table for two",
    lead: "The conversation began at dinner and has not paused since.",
    body:
      "A quiet table, two glasses, and hours that refused to end. By the time the waiter cleared our plates, we knew the story had started.",
    photo: STORY_PHOTOS[1] ?? "/gallery/prewedding-08.jpg",
    photoAlt: "First date",
    layout: "R",
  },
  {
    number: "III",
    date: "December 2022",
    title: "A question under a quiet sky",
    lead:
      "Under a quiet sky, the question was asked — and the future said yes.",
    body:
      "He chose a moment so still it felt borrowed from a dream. She said yes before he finished asking, and the stars seemed to agree.",
    photo: STORY_PHOTOS[2] ?? "/gallery/prewedding-14.jpg",
    photoAlt: "The proposal",
    layout: "L",
  },
  {
    number: "IV",
    date: "June 2026",
    title: "The day everything said yes",
    lead:
      "Every road since that first evening has led, quietly, to this day.",
    body:
      "Now we invite you to stand with us as two stories become one. A chapter written slowly, lovingly, and meant to be shared with those we hold dearest.",
    photo: STORY_PHOTOS[3] ?? "/gallery/prewedding-19.jpg",
    photoAlt: "The wedding",
    layout: "R",
  },
];

export default function StoryChaptersScene() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      gsap.set("[data-story-eyebrow] [data-char]", { y: "100%" });
      gsap.set("[data-story-heading] [data-char]", { y: "100%" });

      gsap.to("[data-story-eyebrow] [data-char]", {
        y: 0,
        duration: 0.9,
        stagger: 0.015,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-story-eyebrow]", start: "top 85%" },
      });

      gsap.to("[data-story-heading] [data-char]", {
        y: 0,
        duration: 1.1,
        stagger: 0.022,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-story-heading]", start: "top 85%" },
      });

      // Each chapter: page reveals + photo clip-path
      gsap.utils.toArray<HTMLElement>("[data-story-chapter]").forEach((el) => {
        const photo = el.querySelector<HTMLElement>("[data-story-photo]");
        const body = el.querySelector<HTMLElement>("[data-story-body]");
        const number = el.querySelector<HTMLElement>("[data-story-number]");

        if (photo) {
          gsap.fromTo(
            photo,
            { clipPath: "inset(0 0 100% 0)", scale: 1.08 },
            {
              clipPath: "inset(0 0 0 0)",
              scale: 1,
              duration: 1.4,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 80%" },
            },
          );
        }

        if (body) {
          gsap.fromTo(
            body,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "power3.out",
              delay: 0.2,
              scrollTrigger: { trigger: el, start: "top 80%" },
            },
          );
        }

        if (number) {
          gsap.fromTo(
            number,
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 85%" },
            },
          );
        }
      });

      // Interstitial video reveal
      gsap.fromTo(
        "[data-story-interstitial]",
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-story-interstitial]",
            start: "top 80%",
          },
        },
      );

      // Audio duck on enter, restore on leave
      const duck = (volume: number) => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(
          new CustomEvent("ambient-audio-duck", { detail: { volume } }),
        );
      };

      ScrollTrigger.create({
        trigger: root,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => duck(0.08),
        onEnterBack: () => duck(0.08),
        onLeave: () => duck(0.18),
        onLeaveBack: () => duck(0.18),
      });
    },
    { scope },
  );

  void ScrollTrigger;

  return (
    <section
      ref={scope}
      id="chapters"
      className="relative py-24 md:py-32 px-6 overflow-hidden parchment"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.22] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.0\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: "320px 320px",
        }}
      />

      <div className="relative z-[2] max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20 md:mb-28">
          <SplitReveal
            text="A love letter in four chapters"
            as="p"
            data-story-eyebrow
            className="font-sans text-[10px] tracking-[0.5em] uppercase text-ink/55 mb-5"
          />
          <SplitReveal
            text="Our Story"
            as="h2"
            data-story-heading
            className="font-script text-ink text-7xl md:text-9xl leading-[0.85]"
          />
          <p className="mt-6 font-serif italic text-ink/65 text-lg md:text-xl tracking-[0.1em]">
            2020 &nbsp;—&nbsp; 2026
          </p>
          <div className="mt-8 flex justify-center text-gold-dark/70">
            <Ornament variant="wave" className="w-40" />
          </div>
        </div>

        {/* Chapters */}
        {CHAPTERS.map((ch, i) => (
          <Fragment key={ch.number}>
            <article
              data-story-chapter
              className="relative py-16 md:py-20"
            >
              <div
                className={`grid gap-8 md:gap-12 items-center ${
                  ch.layout === "L"
                    ? "md:grid-cols-[5fr_7fr]"
                    : "md:grid-cols-[7fr_5fr]"
                }`}
              >
                {/* Photo side */}
                <div
                  data-story-photo
                  className={`relative aspect-[4/5] overflow-hidden rounded-sm shadow-[0_30px_80px_-20px_rgba(60,40,20,0.4)] ${
                    ch.layout === "R" ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={ch.photo}
                    alt={ch.photoAlt}
                    fill
                    className="object-cover torn-mask"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    quality={86}
                  />
                  <div className="absolute inset-4 border border-ink/20 pointer-events-none" />
                </div>

                {/* Text side */}
                <div
                  data-story-body
                  className={`relative ${
                    ch.layout === "R" ? "md:order-1 md:pr-4" : "md:pl-4"
                  }`}
                >
                  <p
                    data-story-number
                    className="font-script text-gold-dark text-6xl md:text-7xl leading-none -mb-2"
                    aria-hidden
                  >
                    Chapter {ch.number}
                  </p>
                  <p className="mt-2 font-sans text-[10px] tracking-[0.45em] uppercase text-ink/55">
                    {ch.date}
                  </p>
                  <h3 className="mt-5 font-serif text-3xl md:text-5xl text-ink font-light leading-[1.1]">
                    {ch.title}
                  </h3>
                  <div className="mt-5 w-12 h-px bg-ink/30" />
                  <p className="mt-6 font-serif italic text-ink/80 text-lg md:text-xl leading-[1.55]">
                    &ldquo;{ch.lead}&rdquo;
                  </p>
                  <div className="mt-6 font-serif text-ink/75 text-[15px] md:text-base leading-[1.85]">
                    <DropCap letter={ch.body.charAt(0)} />
                    {ch.body.slice(1)}
                  </div>
                </div>
              </div>
            </article>

            {/* Interstitial B-roll between chapters II and III */}
            {i === 1 && (
              <div
                data-story-interstitial
                className="relative my-8 md:my-14"
              >
                <PaperCard
                  tone="night"
                  bordered={false}
                  radius={4}
                  className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden"
                >
                  <VideoFrame
                    src={HERO_VIDEO}
                    poster={STORY_PHOTOS[1] ?? "/gallery/prewedding-05.jpg"}
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-[#041d4a] mix-blend-color opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-b from-royal-dark/40 via-transparent to-royal-dark/60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold-light/80 mb-3">
                      An interlude
                    </p>
                    <p className="font-script text-white/95 text-4xl md:text-6xl leading-none">
                      two years, lived slowly
                    </p>
                  </div>
                </PaperCard>
              </div>
            )}
          </Fragment>
        ))}

        {/* Closing flourish */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="flex justify-center text-gold-dark/70 mb-6">
            <Ornament variant="diamond" className="w-44" />
          </div>
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-ink/55">
            To be continued
          </p>
          <p className="mt-3 font-serif italic text-2xl md:text-3xl text-ink tracking-[0.18em] tabular-nums">
            20 · 06 · 26
          </p>
        </div>
      </div>
    </section>
  );
}
