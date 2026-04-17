import { pgTable, text, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { id, createdAtOnly } from "../helpers";

export const guests = pgTable(
  "guests",
  {
    id: id(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    partyName: text("party_name"),
    maxPlusOnes: smallint("max_plus_ones").default(0),
    tableNumber: smallint("table_number"),
    ...createdAtOnly(),
  },
  (table) => ({
    nameUnique: uniqueIndex("guests_name_unique").on(
      sql`lower(${table.firstName})`,
      sql`lower(${table.lastName})`,
    ),
  }),
);

export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;
