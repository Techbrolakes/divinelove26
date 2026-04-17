import { and, eq, sql } from "drizzle-orm";
import type { Database } from "@repo/db";
import { guests, rsvps } from "@repo/db/schema";
import { notFound } from "../../errors";
import type { GuestLookupInput, RsvpInput } from "./rsvp.schema";

export async function lookupGuest(db: Database, input: GuestLookupInput) {
  const guest = await db.query.guests.findFirst({
    where: and(
      sql`lower(${guests.firstName}) = lower(${input.firstName})`,
      sql`lower(${guests.lastName}) = lower(${input.lastName})`,
    ),
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      partyName: true,
      maxPlusOnes: true,
    },
  });

  if (!guest) {
    notFound(
      "We couldn't find your name on the guest list. Please check the spelling or contact us.",
    );
  }

  return guest;
}

export async function submitRsvp(db: Database, input: RsvpInput) {
  const existing = await db.query.guests.findFirst({
    where: eq(guests.id, input.guestId),
    columns: { id: true },
  });
  if (!existing) notFound("Guest");

  await db
    .insert(rsvps)
    .values({
      guestId: input.guestId,
      attending: input.attending,
      mealChoice: input.mealChoice ?? null,
      dietaryRestrictions: input.dietaryRestrictions ?? null,
      plusOneName: input.plusOneName ?? null,
      plusOneMealChoice: input.plusOneMealChoice ?? null,
      plusOneDietary: input.plusOneDietary ?? null,
      notes: input.notes ?? null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: rsvps.guestId,
      set: {
        attending: input.attending,
        mealChoice: input.mealChoice ?? null,
        dietaryRestrictions: input.dietaryRestrictions ?? null,
        plusOneName: input.plusOneName ?? null,
        plusOneMealChoice: input.plusOneMealChoice ?? null,
        plusOneDietary: input.plusOneDietary ?? null,
        notes: input.notes ?? null,
        updatedAt: new Date(),
      },
    });

  return { success: true };
}
