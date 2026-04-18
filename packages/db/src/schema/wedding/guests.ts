import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { id, createdAtOnly } from "../helpers";

export const guests = pgTable(
  "guests",
  {
    id: id(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    invitationCode: text("invitation_code").unique(),
    invitationSentAt: timestamp("invitation_sent_at", { withTimezone: true }),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
    ...createdAtOnly(),
  },
  (table) => ({
    emailUnique: uniqueIndex("guests_email_unique").on(sql`lower(${table.email})`),
  }),
);

export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
