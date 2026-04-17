"use client";

import { ListIcon, MagnifyingGlassIcon, BellIcon } from "@phosphor-icons/react";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[48px] shrink-0 items-center border-b border-gray-200 bg-white">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="cursor-pointer flex h-[48px] w-[48px] items-center justify-center hover:bg-gray-50 md:hidden"
      >
        <ListIcon size={20} className="text-gray-500" />
      </button>

      {/* Search */}
      <div className="flex flex-1 items-center gap-3 px-3.5">
        <MagnifyingGlassIcon size={20} className="shrink-0 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-[14px] text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Notification bell */}
      <div className="flex h-[48px] w-[48px] items-center justify-center border-l border-gray-200">
        <button className="cursor-pointer relative flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <BellIcon size={18} />
        </button>
      </div>
    </header>
  );
}
