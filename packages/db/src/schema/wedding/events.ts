import {
  pgTable,
  text,
  timestamp,
  smallint,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { id, createdAtOnly } from "../helpers";

export const events = pgTable("events", {
  id: id(),
  name: text("name").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }),
  venueName: text("venue_name").notNull(),
  venueAddress: text("venue_address"),
  venueLat: doublePrecision("venue_lat"),
  venueLng: doublePrecision("venue_lng"),
  dressCode: text("dress_code"),
  description: text("description"),
  sortOrder: smallint("sort_order").default(0),
  ...createdAtOnly(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
