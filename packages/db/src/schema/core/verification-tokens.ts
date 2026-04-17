import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { id, createdAtOnly } from "../helpers";

export const tokenTypeEnum = pgEnum("token_type", [
  "email-verification",
  "password-reset",
]);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: id(),
    email: varchar("email", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    type: tokenTypeEnum("type").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    used: boolean("used").default(false).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    ...createdAtOnly(),
  },
  (table) => ({
    emailIdx: index("verification_tokens_email_idx").on(table.email),
    tokenIdx: index("verification_tokens_token_idx").on(table.token),
    typeIdx: index("verification_tokens_type_idx").on(table.type),
  }),
);

export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
