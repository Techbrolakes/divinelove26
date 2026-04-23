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
              How it began · Her Version
            </p>

            <div
              data-story-para
              className="font-serif text-white/85 text-base md:text-lg leading-[1.85] opacity-0"
            >
              <DropCap letter="M" />
              <span className="text-white/85">
                y director had just made a purchase from Ediotech and sent me
                his number so I could receive it on her behalf. At the time,
                it seemed like nothing more than another routine task for a
                Personal Assistant, but I had no idea that heaven was quietly
                arranging the steps of my love story behind the scenes. As
                the days went by, I found myself interacting with him more
                often through assignments from the director, and what began
                as brief work conversations slowly turned into warm exchanges
                filled with laughter, kindness, and an unexpected connection.
                With every conversation, friendship blossomed naturally.
                Looking back now, I smile at how an ordinary assignment
                became the beginning of an extraordinary journey, proving
                that what I thought was just work was truly divine destiny at
                work.
              </span>
            </div>

            <p
              data-story-para
              className="font-serif italic text-gold-light/80 text-xs md:text-sm tracking-[0.25em] uppercase pt-4 opacity-0"
            >
              How it began · His Version
            </p>

            <div
              data-story-para
              className="font-serif text-white/80 text-base md:text-lg leading-[1.85] opacity-0"
            >
              <DropCap letter="I" />
              <span className="text-white/85">
                {" "}received my fianc&eacute;e&rsquo;s contact from her
                highly esteemed director so I could deliver a package to her,
                not realizing that I was stepping into divine destiny. What
                seemed like a simple responsibility at the time became the
                beginning of one of the greatest blessings of my life, as God
                was quietly writing the story of our future together. As time
                went on and we began to interact more often, I found myself
                drawn not only to her presence but to the beauty of her
                heart.
              </span>
            </div>

            <p
              data-story-para
              className="font-serif text-white/80 text-base md:text-lg leading-[1.85] opacity-0"
            >
              With every conversation, I grew to admire the kind of person
              she is &mdash; calm, patient, trusting, and full of grace in a
              world where such qualities are rare. She carried herself with
              wisdom and a quiet strength that made her stand out
              effortlessly. What touched me even more was how she never
              allowed the opinions of others to shape the way she saw me;
              instead, she chose to know me for herself, focus on the
              present, and give me her full trust as a friend.
            </p>

            <p
              data-story-para
              className="font-serif text-white/80 text-base md:text-lg leading-[1.85] opacity-0"
            >
              She became someone I could always depend on, always available
              whenever I needed a prayer partner, encouragement, or simply
              someone to talk to, no matter the time of day. Her consistency,
              kindness, and genuine care spoke louder than words ever could.
              What started as a simple connection became something deeper,
              stronger, and more meaningful than I ever expected. In her, I
              found peace, love, and the kind of rare treasure I had long
              desired.
            </p>

            <p
              data-story-para
              className="font-serif italic text-gold-light/80 text-xs md:text-sm tracking-[0.25em] uppercase pt-4 opacity-0"
            >
              Friendship to Courtship
            </p>

            <p
              data-story-para
              className="font-serif text-white/80 text-base md:text-lg leading-[1.85] opacity-0"
            >
              On a beautiful day, we finally had an honest conversation about
              the attraction we felt for each other, and we both agreed to
              give ourselves time to pray before making any decision,
              especially because neither of us was looking for just a
              boyfriend/girlfriend relationship &mdash; we desired something
              more meaningful and purposeful. After spending time in prayer,
              we both received clarity, answers, and direction from the Holy
              Spirit. He then met with his pastor, and afterward with my
              pastor, before proceeding to meet with both families. After
              receiving the necessary blessings and approvals, we officially
              began our divine love journey.
            </p>

            <p
              data-story-para
              className="font-serif italic text-gold-light/80 text-xs md:text-sm tracking-[0.25em] uppercase pt-4 opacity-0"
            >
              Courtship to Engagement
            </p>

            <p
              data-story-para
              className="font-serif text-white/80 text-base md:text-lg leading-[1.85] opacity-0"
            >
              Knowing that we had already received the necessary approvals
              and blessings from both families and spiritual covering, I
              still felt a deep desire to ask her properly in a way that
              truly reflected the value she holds in my heart. She is someone
              I deeply respect, cherish, and admire, and I wanted that moment
              to be intentional, thoughtful, and worthy of her beautiful
              heart and person.
            </p>

            <p
              data-story-para
              className="font-serif text-white/80 text-base md:text-lg leading-[1.85] opacity-0"
            >
              So I got my sisters on board, my friend, and also had her
              younger sister involved, and together we carefully planned
              every detail of the proposal with love, excitement, and
              purpose. It wasn&rsquo;t rushed or ordinary &mdash; it was
              intentional, filled with meaning, and surrounded by the people
              who mattered most to us.
            </p>

            <p
              data-story-para
              className="font-serif italic text-white/85 text-lg md:text-xl leading-[1.6] border-l-2 border-gold/50 pl-5 opacity-0"
            >
              &ldquo;On that special day, as everything came together, my
              heart was full of gratitude and peace, knowing how far God had
              brought us. In that moment, I asked the question that mattered
              most &mdash; and with a beautiful smile, she said yes.&rdquo;
            </p>

            <p
              data-story-para
              className="font-serif text-white/80 text-base md:text-lg leading-[1.85] opacity-0"
            >
              That yes marked the beginning of our divine love.
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
