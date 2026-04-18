"use client";

import { useRef } from "react";
import Image from "next/image";
import SplitReveal from "@/components/ui/SplitReveal";
import Ornament from "@/components/ui/Ornament";
import { STORY_PHOTOS } from "@/lib/constants";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

const TIMELINE = [
  {
    chapter: "Chapter I",
    year: "2020",
    month: "January",
    date: "January 2020",
    title: "First Meeting",
    quote:
      "A single, ordinary evening — and the beginning of every evening that came after.",
    description:
      "We met at a mutual friend's gathering over borrowed chairs and easy laughter. Neither of us guessed that the night would become the prologue to a life.",
    photo: STORY_PHOTOS[0],
  },
  {
    chapter: "Chapter II",
    year: "2020",
    month: "June",
    date: "June 2020",
    title: "First Date",
    quote:
      "The conversation began at dinner and has not paused since.",
    description:
      "A quiet table, two glasses, and hours that refused to end. By the time the waiter cleared our plates, we knew the story had started.",
    photo: STORY_PHOTOS[1],
  },
  {
    chapter: "Chapter III",
    year: "2022",
    month: "December",
    date: "December 2022",
    title: "The Proposal",
    quote: "Under a quiet sky, the question was asked — and the future said yes.",
    description:
      "He chose a moment so still it felt borrowed from a dream. She said yes before he finished asking, and the stars seemed to agree.",
    photo: STORY_PHOTOS[2],
  },
  {
    chapter: "Chapter IV",
    year: "2026",
    month: "June",
    date: "June 2026",
    title: "The Wedding",
    quote:
      "Every road since that first evening has led, quietly, to this day.",
    description:
      "Now we invite you to stand with us as two stories become one. A chapter written slowly, lovingly, and meant to be shared with those we hold dearest.",
    photo: STORY_PHOTOS[3],
  },
];

export default function OurStory() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      // Heading kinetic reveal
      gsap.set("[data-story-label] [data-char]", { y: "100%" });
      gsap.set("[data-story-title] [data-char]", { y: "100%" });

      gsap.to("[data-story-label] [data-char]", {
        y: 0,
        duration: 0.9,
        stagger: 0.014,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-story-label]",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to("[data-story-title] [data-char]", {
        y: 0,
        duration: 1,
        stagger: 0.02,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "[data-story-title]",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.fromTo(
        "[data-story-range]",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: "[data-story-range]",
            start: "top 90%",
          },
        },
      );

      gsap.fromTo(
        "[data-story-rule]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-story-rule]",
            start: "top 90%",
          },
        },
      );

      // Each chapter — layered reveals + parallax year watermark
      gsap.utils
        .toArray<HTMLElement>("[data-chapter]")
        .forEach((chapter) => {
          const year = chapter.querySelector<HTMLElement>(
            "[data-chapter-year-mark]",
          );
          const photo = chapter.querySelector<HTMLElement>(
            "[data-chapter-photo]",
          );
          const img = chapter.querySelector<HTMLElement>(
            "[data-chapter-photo-img]",
          );
          const content = chapter.querySelector<HTMLElement>(
            "[data-chapter-content]",
          );
          const quote = chapter.querySelector<HTMLElement>(
            "[data-chapter-quote]",
          );
          const stamp = chapter.querySelector<HTMLElement>(
            "[data-chapter-stamp]",
          );

          if (year) {
            gsap.fromTo(
              year,
              { yPercent: 18, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 1.6,
                ease: "expo.out",
                scrollTrigger: {
                  trigger: chapter,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              },
            );
            gsap.to(year, {
              yPercent: -18,
              ease: "none",
              scrollTrigger: {
                trigger: chapter,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          }

          if (photo) {
            gsap.fromTo(
              photo,
              { clipPath: "inset(100% 0% 0% 0%)", scale: 1.1 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.6,
                ease: "expo.out",
                scrollTrigger: {
                  trigger: photo,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }

          if (img) {
            gsap.to(img, {
              yPercent: -14,
              ease: "none",
              scrollTrigger: {
                trigger: chapter,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          }

          if (content) {
            gsap.fromTo(
              content,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 1.1,
                ease: "expo.out",
                delay: 0.15,
                scrollTrigger: {
                  trigger: chapter,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }

          if (quote) {
            gsap.fromTo(
              quote,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 1.6,
                ease: "power2.out",
                delay: 0.4,
                scrollTrigger: {
                  trigger: chapter,
                  start: "top 82%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }

          if (stamp) {
            gsap.fromTo(
              stamp,
              { opacity: 0, scale: 0.7, rotate: -8 },
              {
                opacity: 1,
                scale: 1,
                rotate: 0,
                duration: 1.2,
                ease: "expo.out",
                delay: 0.3,
                scrollTrigger: {
                  trigger: chapter,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }
        });

      // Connector lines between chapters — draw in
      gsap.utils
        .toArray<HTMLElement>("[data-chapter-connector]")
        .forEach((connector) => {
          gsap.fromTo(
            connector,
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 1.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: connector,
                start: "top 85%",
                end: "bottom 50%",
                scrub: true,
              },
            },
          );
        });

      // Closing flourish
      gsap.fromTo(
        "[data-story-closer]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-story-closer]",
            start: "top 90%",
          },
        },
      );

      // Slowly drift the watermark monogram as the section scrolls
      gsap.to("[data-story-watermark]", {
        yPercent: -8,
        rotate: 8,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope },
  );

  void ScrollTrigger;

  return (
    <section
      ref={scope}
      id="story"
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-royal-dark via-royal to-royal-dark" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      <div
        data-story-watermark
        className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform"
      >
        <Image
          src="/logo/monogram-white-on-blue.jpeg"
          alt=""
          width={560}
          height={560}
          className="w-[420px] h-[420px] md:w-[560px] md:h-[560px] rounded-full opacity-[0.05] blur-sm"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section prologue */}
        <div className="text-center mb-20 md:mb-32">
          <SplitReveal
            text="A love letter in four chapters"
            as="p"
            data-story-label
            className="font-sans text-[10px] tracking-[0.5em] uppercase text-white/55 mb-5"
          />
          <SplitReveal
            text="Our Story"
            as="h2"
            data-story-title
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-[0.02em]"
          />
          <p
            data-story-range
            className="mt-6 font-serif italic text-gold-light/80 text-lg md:text-xl tracking-[0.12em] opacity-0"
          >
            2020 &nbsp;—&nbsp; 2026
          </p>
          <div
            data-story-rule
            className="w-24 h-px mx-auto mt-8 bg-gradient-to-r from-transparent via-gold/60 to-transparent origin-center"
          />
        </div>

        {/* Chapters */}
        <div className="relative">
          {TIMELINE.map((item, i) => {
            const isEven = i % 2 === 0;
            const nextItem = TIMELINE[i + 1];
            return (
              <div
                key={item.title}
                data-chapter
                className="relative pb-24 md:pb-32 last:pb-0"
              >
                {/* Giant outline year watermark */}
                <div
                  data-chapter-year-mark
                  aria-hidden
                  className={`absolute top-0 pointer-events-none font-serif text-[6rem] sm:text-[9rem] md:text-[16rem] lg:text-[20rem] leading-none font-light text-white/[0.06] select-none will-change-transform ${
                    isEven
                      ? "left-[-4%] md:left-[-4%]"
                      : "right-[-4%] md:right-[-4%]"
                  }`}
                  style={{ letterSpacing: "-0.04em" }}
                >
                  {item.year}
                </div>

                <div className="relative grid md:grid-cols-12 gap-8 md:gap-12 items-center">
                  {/* Photo side */}
                  <div
                    className={`relative md:col-span-7 ${
                      isEven ? "md:order-1" : "md:order-2"
                    }`}
                  >
                    <div
                      data-chapter-photo
                      className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden rounded-sm shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)]"
                      style={{ willChange: "clip-path, transform" }}
                    >
                      <div
                        data-chapter-photo-img
                        className="absolute -inset-y-10 inset-x-0 will-change-transform"
                      >
                        <Image
                          src={item.photo}
                          alt={`${item.title} — ${item.date}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 58vw"
                          quality={88}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-royal-dark/55 via-transparent to-transparent" />
                      <div className="absolute inset-4 border border-gold/20 pointer-events-none" />
                      <div className="absolute inset-6 border border-gold/10 pointer-events-none" />
                    </div>

                    {/* Postage-stamp style chapter badge overlapping photo */}
                    <div
                      data-chapter-stamp
                      className={`absolute top-4 md:top-10 ${
                        isEven ? "right-4 md:right-[-32px]" : "left-4 md:left-[-32px]"
                      } w-20 h-20 md:w-32 md:h-32 rounded-full bg-royal-dark border border-gold/45 flex items-center justify-center shadow-[0_18px_40px_rgba(0,0,0,0.35)] origin-center opacity-0`}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full absolute"
                      >
                        <defs>
                          <path
                            id={`chapter-circle-${i}`}
                            d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                            fill="none"
                          />
                        </defs>
                        <text className="fill-gold-light font-sans text-[8px] tracking-[0.45em] uppercase">
                          <textPath
                            href={`#chapter-circle-${i}`}
                            startOffset="0"
                          >
                            {`${item.chapter} · ${item.year} · ${item.month} ·`}
                          </textPath>
                        </text>
                      </svg>
                      <div className="text-center">
                        <span className="block font-sans text-[8px] tracking-[0.35em] uppercase text-gold-light/60">
                          No.
                        </span>
                        <span className="block font-serif text-2xl md:text-3xl text-gold-light italic leading-none mt-1">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Text side */}
                  <div
                    data-chapter-content
                    className={`relative md:col-span-5 ${
                      isEven ? "md:order-2" : "md:order-1"
                    }`}
                  >
                    <div
                      className={`md:max-w-md ${
                        isEven ? "md:mr-auto" : "md:ml-auto"
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-5">
                        <span className="h-px w-10 bg-gold/50" />
                        <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold-light">
                          {item.chapter}
                        </span>
                      </div>

                      <p className="font-serif italic text-gold-light/80 text-sm tracking-[0.12em] mb-4">
                        {item.date}
                      </p>

                      <h3 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] text-white font-light leading-[1.02] tracking-[0.01em]">
                        {item.title}
                      </h3>

                      <div className="mt-6 w-16 h-px bg-gradient-to-r from-gold/70 to-transparent" />

                      <p
                        data-chapter-quote
                        className="mt-7 font-serif italic text-white/85 text-lg md:text-xl leading-[1.5] before:content-['“'] before:mr-1 before:text-gold/60 before:text-2xl after:content-['”'] after:ml-1 after:text-gold/60 after:text-2xl opacity-0"
                      >
                        {item.quote}
                      </p>

                      <p className="mt-7 font-sans text-[14px] md:text-[15px] text-white/65 leading-[1.95]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connector to next chapter */}
                {nextItem && (
                  <div
                    aria-hidden
                    className="relative flex flex-col items-center mt-16 md:mt-20"
                  >
                    <div
                      data-chapter-connector
                      className="w-px h-20 md:h-28 bg-gradient-to-b from-gold/60 via-gold/30 to-transparent origin-top"
                      style={{ willChange: "transform" }}
                    />
                    <span className="absolute top-[calc(50%-6px)] w-3 h-3 rotate-45 border border-gold/60 bg-royal-dark" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Closing flourish */}
        <div
          data-story-closer
          className="mt-10 md:mt-16 text-center opacity-0"
        >
          <div className="flex justify-center text-gold mb-6">
            <Ornament variant="diamond" className="w-40" />
          </div>
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold-light/70">
            To be continued
          </p>
          <p className="mt-3 font-serif italic text-2xl md:text-3xl text-white tracking-[0.18em] tabular-nums">
            20 · 06 · 26
          </p>
        </div>
      </div>
    </section>
  );
}
