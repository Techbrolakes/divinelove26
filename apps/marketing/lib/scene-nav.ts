import type { Route } from "next";

// Single source of truth for the scene order + their neighbours.
export interface SceneStep {
  id: string;
  href: Route;
  label: string;
  /** Label shown in nav buttons (short form). */
  shortLabel: string;
}

export const SCENE_ORDER: SceneStep[] = [
  { id: "hero", href: "/" as Route, label: "The Invitation", shortLabel: "Invitation" },
  { id: "story", href: "/story" as Route, label: "Our Story", shortLabel: "Our Story" },
  { id: "events", href: "/events" as Route, label: "Events", shortLabel: "Events" },
  { id: "gifts", href: "/gifts" as Route, label: "With Gratitude", shortLabel: "Gifts" },
  { id: "gallery", href: "/gallery" as Route, label: "The Gallery", shortLabel: "Gallery" },
];

export function getNeighbours(id: string) {
  const idx = SCENE_ORDER.findIndex((s) => s.id === id);
  if (idx < 0) return { step: 1, total: SCENE_ORDER.length, prev: undefined, next: undefined };
  const prev = SCENE_ORDER[idx - 1];
  const next = SCENE_ORDER[idx + 1];
  return {
    step: idx + 1,
    total: SCENE_ORDER.length,
    prev: prev
      ? { href: prev.href, label: prev.shortLabel }
      : undefined,
    next: next
      ? { href: next.href, label: next.shortLabel }
      : undefined,
  };
}
