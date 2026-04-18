import { sql } from "drizzle-orm";
import type { Database } from "@repo/db";
import { guests } from "@repo/db/schema";
import { conflict, serverError } from "../../errors";
import type { RegisterInput } from "./rsvp.schema";

export async function register(db: Database, input: RegisterInput) {
  const existing = await db.query.guests.findFirst({
    where: sql`lower(${guests.email}) = ${input.email}`,
    columns: { id: true },
  });

  if (existing) {
    conflict("This email has already registered.");
  }

  const [created] = await db
    .insert(guests)
    .values({
      fullName: input.fullName,
      email: input.email,
    })
    .returning({ id: guests.id });

  if (!created) serverError("Failed to save registration");

  return { success: true, guestId: created.id };
}
