import { pgTable, text, smallint } from "drizzle-orm/pg-core";
import { id, createdAtOnly } from "../helpers";

export const galleryImages = pgTable("gallery_images", {
  id: id(),
  src: text("src").notNull(),
  alt: text("alt"),
  sortOrder: smallint("sort_order").default(0),
  ...createdAtOnly(),
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type NewGalleryImage = typeof galleryImages.$inferInsert;
