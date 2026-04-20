// Scene registry — single source of truth for the cinematic landing.
// Each scene owns an anchor id, display title, colorway, and an ambient
// music volume target. The home page composes scenes in order and the
// navbar maps its links to anchors.

export type SceneColorway =
  | "royal-night" // deep blue envelope world
  | "parchment" // warm cream "desk" world
  | "ink-letter" // cream paper + ink prose
  | "ivory-gallery" // white gallery
  | "royal-program" // deep blue program booklet
  | "midnight"; // fade-to-black colophon

export interface Scene {
  id: string;
  anchor: string;
  title: string;
  colorway: SceneColorway;
  audioVolume: number; // 0..1 — target ambient music volume while this scene is active
}

export const SCENES = [
  {
    id: "envelope",
    anchor: "top",
    title: "The Envelope",
    colorway: "royal-night",
    audioVolume: 0.18,
  },
  {
    id: "letter",
    anchor: "save-the-date",
    title: "Save the Date",
    colorway: "royal-night",
    audioVolume: 0.22,
  },
  {
    id: "desk",
    anchor: "desk",
    title: "The Desk",
    colorway: "parchment",
    audioVolume: 0.2,
  },
  {
    id: "story",
    anchor: "story",
    title: "Our Story",
    colorway: "ink-letter",
    audioVolume: 0.08, // duck deeply while reading the prose
  },
  {
    id: "gallery",
    anchor: "gallery",
    title: "Gallery",
    colorway: "ivory-gallery",
    audioVolume: 0.18,
  },
  {
    id: "events",
    anchor: "events",
    title: "The Program",
    colorway: "parchment",
    audioVolume: 0.18,
  },
  {
    id: "gift",
    anchor: "gift",
    title: "With Gratitude",
    colorway: "royal-night",
    audioVolume: 0.18,
  },
  {
    id: "rsvp",
    anchor: "rsvp",
    title: "Reply Required",
    colorway: "royal-night",
    audioVolume: 0.2,
  },
  {
    id: "colophon",
    anchor: "footer",
    title: "Colophon",
    colorway: "midnight",
    audioVolume: 0.12,
  },
] as const satisfies readonly Scene[];

export const SCENES_BY_ID: Record<string, Scene> = Object.fromEntries(
  SCENES.map((s) => [s.id, s]),
);

// Asset references used across scenes.
export const HERO_VIDEO = "/video/hero-reel.mp4";
export const LETTER_VIDEO = "/video/save-the-date-moment.mp4";
export const MONOGRAM = "/logo/monogram-white-on-blue.jpeg";
export const MONOGRAM_INVERSE = "/logo/monogram-blue-on-white.jpeg";
