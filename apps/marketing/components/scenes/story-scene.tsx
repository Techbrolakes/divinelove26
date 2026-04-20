"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import DropCap from "@/components/props/drop-cap";
import SceneHeader from "@/components/ui/scene-header";
import { useGSAP, gsap } from "@/lib/gsap";

// A hand-picked set of proposal photos used as a vertical collage on
// the left of the story page. Mix of wider and portrait shots so the
// collage feels like a spread, not a grid.
const PROPOSAL_SHOTS = [
  { src: "/gallery/proposal-01.jpg", alt: "The moment he asked", caption: "the question" },
  { src: "/gallery/proposal-05.jpg", alt: "Her yes", caption: "her yes" },
];

/**
 * Story — the full written love letter paired with a proposal photo
 * collage on the left. This page is allowed to exceed 100vh; its own
 * scroll container handles overflow while the shared blue backdrop
 * stays fixed behind.
 */
export default function StoryScene({
  footer,
}: {
  /** Slot rendered at the end of the scrollable content (prev/next nav). */
  footer?: ReactNode;
} = {}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-story-shot]",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.05,
          delay: 0.15,
        },
      );

      gsap.fromTo(
        "[data-story-para]",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.04,
          delay: 0.25,
        },
      );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative z-[1] h-screen overflow-y-auto overflow-x-hidden px-5 md:px-10 pt-24 pb-36 no-scrollbar"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <SceneHeader
            id="story"
            eyebrow="A love letter in writing"
            title="Our Story"
            subtitle="2020 — 2026"
          />
        </div>

        {/* Two-column: proposal collage on left, prose on right */}
        <div className="grid md:grid-cols-[5fr_6fr] gap-10 md:gap-14 items-start">
          {/* Proposal photo collage */}
          <div className="space-y-5 md:space-y-6 md:sticky md:top-8">
            {PROPOSAL_SHOTS.map((shot, i) => (
              <figure
                key={shot.src}
                data-story-shot
                className={`relative overflow-hidden rounded-sm bg-[#fdfaf3] p-2 md:p-2.5 shadow-[0_18px_48px_-18px_rgba(0,0,0,0.55)] ring-1 ring-black/10 opacity-0 ${
                  shot.caption ? "pb-8" : "pb-3"
                }`}
                style={{
                  transform: `rotate(${[-1.2, 0.8, -0.6, 1.4][i] ?? 0}deg)`,
                }}
              >
                <div
                  className="relative w-full"
                  style={{
                    aspectRatio: i === 0 ? "4 / 5" : i === 1 ? "4 / 3" : "3 / 4",
                  }}
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    className="object-cover rounded-[2px]"
                    sizes="(max-width: 768px) 100vw, 45vw"
                    quality={85}
                  />
                </div>
                {shot.caption && (
                  <figcaption className="absolute left-0 right-0 bottom-1.5 text-center font-script text-ink/80 text-lg leading-none">
                    {shot.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>

          {/* Prose — framed in a deeper blue panel so the copy pops off the
              shared backdrop. */}
          <div
            className="relative space-y-7 md:space-y-8 rounded-sm border border-gold/30 p-6 md:p-10 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)]"
            style={{
              background:
                "linear-gradient(160deg, #0a2255 0%, #061a43 55%, #04123a 100%)",
            }}
          >
            {/* Hairline gold inner frame */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-2 border border-gold/15 rounded-[1px]"
            />

            <p
              data-story-para
              className="relative font-serif italic text-gold-light/85 text-xs md:text-sm tracking-[0.25em] uppercase opacity-0"
            >
              Chapter I · How it began
            </p>

            <div
              data-story-para
              className="font-serif text-white/85 text-base md:text-lg leading-[1.85] opacity-0"
            >
              <DropCap letter="W" />
              <span className="text-white">
                e met at a mutual friend&rsquo;s gathering over borrowed chairs
                and easy laughter. Neither of us guessed that the night would
                become the prologue to a life.
              </span>
            </div>

            <p
              data-story-para
              className="font-serif italic text-white/85 text-lg md:text-xl leading-[1.6] border-l-2 border-gold/50 pl-5 opacity-0"
            >
              &ldquo;The conversation began at dinner and has not paused since.&rdquo;
            </p>

            <p
              data-story-para
              className="font-serif text-white/80 text-base md:text-lg leading-[1.85] opacity-0"
            >
              A quiet table, two glasses, and hours that refused to end. By
              the time the waiter cleared our plates, we knew the story had
              started. Conversations turned into weekends, weekends into
              seasons, and seasons into a life we built, quietly, on purpose.
            </p>

            <p
              data-story-para
              className="font-serif italic text-gold-light/80 text-xs md:text-sm tracking-[0.25em] uppercase pt-4 opacity-0"
            >
              Chapter II · The Question
            </p>

            <p
              data-story-para
              className="font-serif text-white/80 text-base md:text-lg leading-[1.85] opacity-0"
            >
              In December 2022, under a quiet sky, a question was asked — and
              the future said yes. He chose a moment so still it felt
              borrowed from a dream; she said yes before he finished asking,
              and the stars seemed to agree.
            </p>

            <p
              data-story-para
              className="font-serif italic text-white/85 text-lg md:text-xl leading-[1.6] border-l-2 border-gold/50 pl-5 opacity-0"
            >
              &ldquo;Now we are choosing forever, on purpose.&rdquo;
            </p>

            <p
              data-story-para
              className="font-serif text-white/80 text-base md:text-lg leading-[1.85] opacity-0"
            >
              Now we invite you to stand with us as two stories become one.
              A chapter written slowly, lovingly, and meant to be shared with
              those we hold dearest.
            </p>

            <div data-story-para className="pt-3 flex items-center gap-4 opacity-0">
              <span className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold-light/75">
                With love,
              </span>
              <span className="font-script text-gold-light text-3xl md:text-4xl leading-none">
                D &amp; L
              </span>
            </div>
          </div>
        </div>

        {footer}
      </div>
    </section>
  );
}
