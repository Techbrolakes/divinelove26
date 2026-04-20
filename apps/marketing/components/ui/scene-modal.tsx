"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface SceneModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Max width of the modal card. */
  maxWidth?: string;
}

/**
 * Viewport-bounded modal — never exceeds the window height. A scrollable
 * inner container handles overflow so the outer card stays visually at
 * 100vh tops. Close on Escape, backdrop click, or the × button.
 */
export default function SceneModal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
}: SceneModalProps) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // focus close button for a11y
    window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Dialog"}
      className="fixed inset-0 z-[900] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxWidth} max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] flex flex-col rounded-[6px] envelope-paper text-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)] ring-1 ring-gold/25`}
      >
        <div className="flex items-center justify-between gap-4 px-5 md:px-7 pt-5 md:pt-6 pb-3 border-b border-gold/15">
          {title ? (
            <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold-light/80">
              {title}
            </p>
          ) : (
            <span />
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-white hover:border-gold/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
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

        <div className="px-5 md:px-8 py-5 md:py-7 overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
