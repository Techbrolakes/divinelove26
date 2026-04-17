import { boolean, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { id, timestamps } from "../helpers";

export const notifications = pgTable("notifications", {
  id: id(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"),
  isRead: boolean("is_read").notNull().default(false),
  metadata: text("metadata"),
  ...timestamps(),
});

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
