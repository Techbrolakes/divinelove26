import { pgTable, uuid, boolean, text, timestamp } from "drizzle-orm/pg-core";
import { id } from "../helpers";
import { guests } from "./guests";

export const rsvps = pgTable("rsvps", {
  id: id(),
  guestId: uuid("guest_id")
    .notNull()
    .unique()
    .references(() => guests.id, { onDelete: "cascade" }),
  attending: boolean("attending").notNull(),
  mealChoice: text("meal_choice"),
  dietaryRestrictions: text("dietary_restrictions"),
  plusOneName: text("plus_one_name"),
  plusOneMealChoice: text("plus_one_meal_choice"),
  plusOneDietary: text("plus_one_dietary"),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Rsvp = typeof rsvps.$inferSelect;
export type NewRsvp = typeof rsvps.$inferInsert;
