// 2026-06-20 at 14:00 WAT (UTC+1) — anchored to Lagos so viewers in any timezone
// count down to the same real-world moment.
export const WEDDING_DATE = new Date("2026-06-20T14:00:00+01:00");

export const COUPLE = {
  partner1: "Idah Joy Itsosi",
  partner2: "Ikhioya David Ohiozoje",
  hashtag: "#DIVINELOVE26",
};

export const MEAL_OPTIONS = [
  { value: "chicken", label: "Chicken" },
  { value: "fish", label: "Fish" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
] as const;

export const NAV_LINKS = [
  { href: "/story", label: "Our Story" },
  { href: "/events", label: "Events" },
  { href: "/gifts", label: "Gifts" },
  { href: "/gallery", label: "Gallery" },
] as const;

export const CONFETTI_COLORS = ["#0b3d91", "#a8b4c4", "#1a56c4", "#c5cdd8", "#ffffff"];

export const HERO_SLIDES = [
  "/gallery/prewedding-05.jpg",
  "/gallery/prewedding-12.jpg",
  "/gallery/prewedding-17.jpg",
] as const;

export const STORY_PHOTOS = [
  "/gallery/prewedding-01.jpg",
  "/gallery/prewedding-08.jpg",
  "/gallery/prewedding-14.jpg",
  "/gallery/prewedding-19.jpg",
] as const;

export const SAVE_THE_DATE_BACKDROP = "/gallery/prewedding-03.jpg";
export const EVENTS_BACKDROP = "/gallery/prewedding-11.jpg";
export const RSVP_BACKDROP = "/gallery/prewedding-20.jpg";
export const GIFT_BACKDROP = "/gallery/prewedding-18.jpg";

export const GIFT_ACCOUNTS = [
  {
    label: "Primary Account",
    bank: "Parallex Bank",
    name: "Idah Joy Itsosi",
    number: "1000219510",
  },
  {
    label: "Alternate Account",
    bank: "Providus Bank",
    name: "Ikhioya David",
    number: "6504055827",
  },
] as const;

export const GIFT_ESPEES_HANDLE = "@DIVINELOVE26";
