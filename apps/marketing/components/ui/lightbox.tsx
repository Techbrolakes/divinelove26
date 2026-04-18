"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useGSAP, gsap } from "@/lib/gsap";

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect?: (index: number) => void;
  autoplayMs?: number;
  audioSrc?: string;
}

const DEFAULT_AUTOPLAY_MS = 5200;
const DEFAULT_AUDIO_SRC = "/audio/alabaster-box.mp3";
const AUDIO_START_SECONDS = 30;
const TARGET_VOLUME = 0.35;
const AUDIO_FADE_MS = 1800;
const SWIPE_THRESHOLD = 60;

export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onSelect,
  autoplayMs = DEFAULT_AUTOPLAY_MS,
  audioSrc = DEFAULT_AUDIO_SRC,
}: LightboxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioFadeRafRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [stripOffset, setStripOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Audio helpers — smooth fade in/out
  const fadeAudioTo = useCallback((target: number, duration = AUDIO_FADE_MS) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioFadeRafRef.current !== null) {
      cancelAnimationFrame(audioFadeRafRef.current);
      audioFadeRafRef.current = null;
    }
    const start = audio.volume;
    const startTime = performance.now();
    const tick = (now: number) => {
      const pct = Math.min((now - startTime) / duration, 1);
      // easeInOutQuad
      const eased = pct < 0.5 ? 2 * pct * pct : 1 - Math.pow(-2 * pct + 2, 2) / 2;
      audio.volume = start + (target - start) * eased;
      if (pct < 1) {
        audioFadeRafRef.current = requestAnimationFrame(tick);
      } else {
        audioFadeRafRef.current = null;
        if (target <= 0.001) {
          audio.pause();
        }
      }
    };
    audioFadeRafRef.current = requestAnimationFrame(tick);
  }, []);

  const startAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = audio.volume || 0;
    if (audio.currentTime < AUDIO_START_SECONDS) {
      try {
        audio.currentTime = AUDIO_START_SECONDS;
      } catch {
        /* seeking before metadata ready — handled by loadedmetadata below */
      }
    }
    audio.play().catch(() => {
      /* autoplay blocked — user will click again */
    });
    fadeAudioTo(isMuted ? 0 : TARGET_VOLUME);
  }, [fadeAudioTo, isMuted]);

  const stopAudio = useCallback(() => {
    fadeAudioTo(0);
  }, [fadeAudioTo]);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  // Run audio on play/mute state change
  useEffect(() => {
    if (isPlaying) {
      startAudio();
    } else {
      stopAudio();
    }
  }, [isPlaying, startAudio, stopAudio]);

  // React to mute toggle while playing
  useEffect(() => {
    if (!isPlaying) return;
    fadeAudioTo(isMuted ? 0 : TARGET_VOLUME, 600);
  }, [isMuted, isPlaying, fadeAudioTo]);

  const goNext = useCallback(() => {
    onNext();
  }, [onNext]);

  const goPrev = useCallback(() => {
    onPrev();
  }, [onPrev]);

  const jumpTo = useCallback(
    (index: number) => {
      if (!onSelect) return;
      if (index < 0 || index >= images.length) return;
      onSelect(index);
    },
    [onSelect, images.length],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "m" || e.key === "M") {
        setIsMuted((m) => !m);
      }
    },
    [onClose, goPrev, goNext, togglePlay],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = original;
    };
  }, [handleKeyDown]);

  // Autoplay advance + progress bar
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }
    let rafId = 0;
    let start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / autoplayMs, 1);
      setProgress(pct);
      if (pct >= 1) {
        goNext();
        start = performance.now();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, autoplayMs, goNext, currentIndex]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioFadeRafRef.current !== null) {
        cancelAnimationFrame(audioFadeRafRef.current);
      }
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);

  // Preload adjacent images
  useEffect(() => {
    if (typeof window === "undefined") return;
    const preload = (i: number) => {
      const img = images[i];
      if (!img) return;
      const el = new window.Image();
      el.src = img.src;
    };
    preload((currentIndex + 1) % images.length);
    preload((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images]);

  // Smooth-slide thumbnails to keep active centered
  useLayoutEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>(
      `[data-lightbox-thumb='${currentIndex}']`,
    );
    if (!active) return;
    const containerWidth = strip.offsetWidth;
    const activeCenter = active.offsetLeft + active.offsetWidth / 2;
    const desired = activeCenter - containerWidth / 2;
    const track = active.parentElement;
    const max = track ? Math.max(0, track.scrollWidth - containerWidth) : 0;
    const clamped = Math.max(0, Math.min(desired, max));
    setStripOffset(-clamped);
  }, [currentIndex, images.length]);

  useGSAP(
    () => {
      if (!rootRef.current) return;
      gsap.fromTo(
        rootRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    },
    { scope: rootRef },
  );

  const current = images[currentIndex];

  if (!current) return null;
  if (!mounted) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartX.current;
    const dy = touch.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  const overlay = (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      onClick={onClose}
    >
      {/* Hidden audio element — loaded once, faded via JS */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        loop
        crossOrigin="anonymous"
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          if (el.currentTime < AUDIO_START_SECONDS) {
            el.currentTime = AUDIO_START_SECONDS;
          }
        }}
      />

      {/* Top bar */}
      <div
        className="relative z-20 flex items-center justify-between gap-3 px-5 md:px-8 py-4 border-b border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <span className="font-serif italic text-gold-light/90 text-lg md:text-xl tabular-nums">
            {String(currentIndex + 1).padStart(2, "0")}
            <span className="text-white/30 mx-1.5">/</span>
            <span className="text-white/50 text-sm md:text-base">
              {String(images.length).padStart(2, "0")}
            </span>
          </span>
          <span className="hidden sm:inline-block font-sans text-[10px] tracking-[0.4em] uppercase text-white/40">
            Divine &amp; Love · Gallery
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            aria-label={isMuted ? "Unmute slideshow audio" : "Mute slideshow audio"}
            aria-pressed={isMuted}
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-white hover:border-gold/60 transition-colors"
          >
            {isMuted ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M15.54 8.46a5 5 0 010 7.07" />
              </svg>
            )}
          </button>

          {/* Prominent Play/Pause — pulses to invite click */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            aria-pressed={isPlaying}
            className={`group relative inline-flex items-center gap-2 md:gap-3 rounded-full px-4 md:px-5 h-11 md:h-12 overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
              isPlaying
                ? "bg-gold text-royal-dark border border-gold shadow-[0_0_32px_rgba(201,168,76,0.6)]"
                : "bg-white/5 hover:bg-gold/90 hover:text-royal-dark border border-gold/60 text-gold-light"
            }`}
          >
            <span
              className={`relative z-[2] inline-flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full ${
                isPlaying
                  ? "bg-royal-dark text-gold"
                  : "bg-gold text-royal-dark"
              }`}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                  <rect x="7" y="5" width="3.5" height="14" rx="0.8" />
                  <rect x="13.5" y="5" width="3.5" height="14" rx="0.8" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3 translate-x-[1px]"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </span>
            <span className="relative z-[2] font-sans text-[10px] md:text-[11px] tracking-[0.35em] uppercase">
              {isPlaying ? "Playing" : "Play slideshow"}
            </span>

            {/* Horizontal progress fill */}
            {isPlaying && (
              <>
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 bg-royal-dark/10 pointer-events-none"
                  style={{
                    width: `${Math.max(0, Math.min(progress, 1)) * 100}%`,
                    transition: "width 60ms linear",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-[2px] bg-royal-dark/70 pointer-events-none"
                  style={{
                    width: `${Math.max(0, Math.min(progress, 1)) * 100}%`,
                    transition: "width 60ms linear",
                  }}
                />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 hover:text-white hover:border-gold/60 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main stage */}
      <div
        className="relative flex-1 flex items-center justify-center px-4 md:px-12 py-6 md:py-8 min-h-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous photo"
          className="group absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-11 w-11 md:h-14 md:w-14 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/75 backdrop-blur-md hover:text-white hover:border-gold/60 hover:bg-black/50 transition-colors"
        >
          <svg
            className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* Image stage — no transition, instant swap */}
        <div
          className="relative w-full h-full max-w-[90vw] max-h-full flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full flex-1 min-h-0 overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
                quality={92}
              />
            </div>

            {/* Per-slide segmented progress — horizontal on mobile, vertical on desktop */}
            {isPlaying && (
              <div
                className="pointer-events-none absolute z-[2] flex gap-1 md:gap-1.5 inset-x-3 bottom-3 md:inset-x-auto md:bottom-auto md:left-3 md:top-1/2 md:-translate-y-1/2 md:flex-col md:h-[60%] md:max-h-[420px]"
                role="progressbar"
                aria-label={`Slide ${currentIndex + 1} of ${images.length}`}
                aria-valuemin={0}
                aria-valuemax={images.length}
                aria-valuenow={currentIndex + 1}
              >
                {images.map((_, i) => {
                  const fill =
                    i < currentIndex
                      ? 1
                      : i === currentIndex
                        ? Math.max(0, Math.min(progress, 1))
                        : 0;
                  const transition =
                    i === currentIndex
                      ? "60ms linear"
                      : "300ms ease-out";
                  return (
                    <span
                      key={i}
                      aria-hidden
                      className="relative flex-1 rounded-full bg-white/15 overflow-hidden h-[3px] md:h-auto md:w-[3px]"
                    >
                      {/* mobile: fill left-to-right */}
                      <span
                        className="absolute inset-y-0 left-0 bg-gold shadow-[0_0_10px_rgba(201,168,76,0.55)] md:hidden"
                        style={{
                          width: `${fill * 100}%`,
                          transition: `width ${transition}`,
                        }}
                      />
                      {/* desktop: fill top-to-bottom */}
                      <span
                        className="absolute inset-x-0 top-0 bg-gold shadow-[0_0_10px_rgba(201,168,76,0.55)] hidden md:block"
                        style={{
                          height: `${fill * 100}%`,
                          transition: `height ${transition}`,
                        }}
                      />
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next photo"
          className="group absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-11 w-11 md:h-14 md:w-14 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/75 backdrop-blur-md hover:text-white hover:border-gold/60 hover:bg-black/50 transition-colors"
        >
          <svg
            className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>

      {/* Caption + thumbnails */}
      <div
        className="relative z-10 border-t border-white/5 pt-3 pb-4 md:pb-5"
        onClick={(e) => e.stopPropagation()}
      >
        {current.caption && (
          <p
            key={`caption-${currentIndex}`}
            className="px-5 md:px-8 mb-3 font-serif italic text-white/75 text-sm md:text-base text-center"
          >
            {current.caption}
          </p>
        )}

        <div ref={thumbStripRef} className="relative overflow-hidden px-5 md:px-8">
          <div
            className="flex gap-2 md:gap-3 transition-transform duration-[700ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform"
            style={{ transform: `translate3d(${stripOffset}px, 0, 0)` }}
          >
            {images.map((image, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  key={image.src}
                  type="button"
                  data-lightbox-thumb={i}
                  onClick={() => jumpTo(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={isActive}
                  className={`relative shrink-0 overflow-hidden rounded-[3px] transition-all duration-500 ${
                    isActive
                      ? "h-16 w-16 md:h-20 md:w-20 ring-2 ring-gold shadow-[0_0_24px_rgba(201,168,76,0.35)]"
                      : "h-14 w-14 md:h-16 md:w-16 opacity-55 hover:opacity-95 ring-1 ring-white/10"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                    aria-hidden="true"
                  />
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/25 transition-opacity duration-300 hover:bg-black/0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
