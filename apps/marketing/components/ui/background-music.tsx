"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SRC = "/audio/alabaster-box.mp3";
const START_SECONDS = 30;
const TARGET_VOLUME = 0.18;
const FADE_MS = 1600;

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const suspendedByLightboxRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pendingAutoplay, setPendingAutoplay] = useState(false);

  const fadeTo = useCallback((target: number, duration = FADE_MS) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
    const start = audio.volume;
    const startTime = performance.now();
    const tick = (now: number) => {
      const pct = Math.min((now - startTime) / duration, 1);
      const eased = pct < 0.5 ? 2 * pct * pct : 1 - Math.pow(-2 * pct + 2, 2) / 2;
      audio.volume = start + (target - start) * eased;
      if (pct < 1) {
        fadeRafRef.current = requestAnimationFrame(tick);
      } else {
        fadeRafRef.current = null;
        if (target <= 0.001) audio.pause();
      }
    };
    fadeRafRef.current = requestAnimationFrame(tick);
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime < START_SECONDS) {
      try {
        audio.currentTime = START_SECONDS;
      } catch {
        /* metadata not ready — handled by loadedmetadata */
      }
    }
    audio.volume = 0;
    try {
      await audio.play();
      setIsPlaying(true);
      setPendingAutoplay(false);
      fadeTo(TARGET_VOLUME);
    } catch {
      setIsPlaying(false);
      setPendingAutoplay(true);
    }
  }, [fadeTo]);

  const pause = useCallback(() => {
    fadeTo(0, 600);
    setIsPlaying(false);
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else void play();
  }, [isPlaying, pause, play]);

  // Attempt autoplay on mount
  useEffect(() => {
    void play();
  }, [play]);

  // If autoplay was blocked, start on first user gesture
  useEffect(() => {
    if (!pendingAutoplay) return;
    const onGesture = () => {
      void play();
    };
    window.addEventListener("pointerdown", onGesture, { once: true, passive: true });
    window.addEventListener("keydown", onGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, [pendingAutoplay, play]);

  // Duck while the lightbox plays its own audio
  useEffect(() => {
    const onLightboxStart = () => {
      if (isPlaying) {
        suspendedByLightboxRef.current = true;
        pause();
      }
    };
    const onLightboxStop = () => {
      if (suspendedByLightboxRef.current) {
        suspendedByLightboxRef.current = false;
        void play();
      }
    };
    window.addEventListener("lightbox-audio-start", onLightboxStart);
    window.addEventListener("lightbox-audio-stop", onLightboxStop);
    return () => {
      window.removeEventListener("lightbox-audio-start", onLightboxStart);
      window.removeEventListener("lightbox-audio-stop", onLightboxStop);
    };
  }, [isPlaying, pause, play]);

  useEffect(() => {
    return () => {
      if (fadeRafRef.current !== null) cancelAnimationFrame(fadeRafRef.current);
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={SRC}
        loop
        preload="auto"
        onLoadedMetadata={(e) => {
          if (e.currentTarget.currentTime < START_SECONDS) {
            e.currentTarget.currentTime = START_SECONDS;
          }
        }}
      />
      <div className="fixed right-5 bottom-20 md:right-8 md:bottom-28 z-50 flex items-center gap-3">
        <span
          aria-hidden
          className={`hidden sm:inline-block font-sans text-[10px] tracking-[0.35em] uppercase text-gold-light/85 whitespace-nowrap transition-opacity duration-700 ${
            pendingAutoplay && !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          Tap anywhere for music
        </span>
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
          aria-pressed={isPlaying}
          className="group flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border border-gold/40 bg-royal-dark/85 backdrop-blur-md text-gold-light shadow-[0_14px_36px_rgba(0,0,0,0.35)] transition-[background-color,border-color,color] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:border-gold hover:bg-royal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        >
          {isPlaying ? <WaveBars /> : <MusicNote />}
        </button>
      </div>
    </>
  );
}

function WaveBars() {
  return (
    <span className="relative flex items-end justify-center gap-[3px] h-4 w-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[2.5px] h-full origin-bottom rounded-full bg-current"
          style={{
            animation: `music-wave 1.1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function MusicNote() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" />
      <circle cx="18" cy="16" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}
