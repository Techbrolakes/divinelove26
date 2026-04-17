import { boolean, pgTable, varchar, pgEnum, index } from "drizzle-orm/pg-core";
import { id, timestamps } from "../helpers";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable(
  "users",
  {
    id: id(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }),
    avatar: varchar("avatar", { length: 500 }),
    role: userRoleEnum("role").default("user").notNull(),
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    ...timestamps(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
