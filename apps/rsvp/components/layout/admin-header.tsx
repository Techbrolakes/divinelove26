"use client";

import { ListIcon } from "@phosphor-icons/react";

interface AdminHeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

export function AdminHeader({ onMenuClick, title }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[56px] shrink-0 items-center border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <button
        onClick={onMenuClick}
        className="flex h-[56px] w-[56px] cursor-pointer items-center justify-center text-royal hover:text-royal-dark md:hidden"
        aria-label="Open menu"
      >
        <ListIcon size={20} weight="bold" />
      </button>

      <div className="flex flex-1 items-center gap-3 px-4 md:px-6">
        <span className="font-serif italic text-royal text-[15px] tracking-wide hidden md:inline">
          Divine Love 26
        </span>
        {title && (
          <>
            <span className="text-royal-300 hidden md:inline">&middot;</span>
            <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-warm-500">
              {title}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 px-4 md:px-6">
        <span className="hidden sm:inline font-sans text-[10px] tracking-[0.3em] uppercase text-warm-400">
          20 June 2026
        </span>
      </div>
    </header>
  );
}
