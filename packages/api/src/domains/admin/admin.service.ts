import { asc, eq } from "drizzle-orm";
import type { Database } from "@repo/db";
import { guests, rsvps } from "@repo/db/schema";
import type { AddGuestInput } from "./admin.schema";

export async function getStats(db: Database) {
  const allGuests = await db.select({ id: guests.id }).from(guests);
  const allRsvps = await db.select().from(rsvps);

  const attending = allRsvps.filter((r) => r.attending);
  const declined = allRsvps.filter((r) => !r.attending);
  const totalGuests = allGuests.length;
  const pending = totalGuests - allRsvps.length;

  const mealCounts: Record<string, number> = {};
  for (const r of attending) {
    if (r.mealChoice) {
      mealCounts[r.mealChoice] = (mealCounts[r.mealChoice] ?? 0) + 1;
    }
    if (r.plusOneMealChoice) {
      mealCounts[r.plusOneMealChoice] =
        (mealCounts[r.plusOneMealChoice] ?? 0) + 1;
    }
  }

  return {
    total: totalGuests,
    attending: attending.length,
    declined: declined.length,
    pending,
    mealCounts,
  };
}

export async function getGuests(db: Database) {
  const rows = await db
    .select()
    .from(guests)
    .leftJoin(rsvps, eq(rsvps.guestId, guests.id))
    .orderBy(asc(guests.lastName));

  return rows.map((row) => ({
    ...row.guests,
    rsvp: row.rsvps,
  }));
}

export async function addGuest(db: Database, input: AddGuestInput) {
  const [created] = await db
    .insert(guests)
    .values({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email ?? null,
      phone: input.phone ?? null,
      partyName: input.partyName ?? null,
      maxPlusOnes: input.maxPlusOnes ?? 0,
    })
    .returning();
  if (!created) throw new Error("Failed to create guest");
  return created;
}

export async function deleteGuest(db: Database, guestId: string) {
  await db.delete(guests).where(eq(guests.id, guestId));
  return { success: true };
}

export async function importGuestsFromCsv(db: Database, csvText: string) {
  const lines = csvText.trim().split("\n");
  const headerLine = lines[0];
  if (!headerLine) return { count: 0 };
  const headers = headerLine.split(",").map((h) => h.trim().toLowerCase());

  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    return {
      firstName: row["first_name"] || row["firstname"] || "",
      lastName: row["last_name"] || row["lastname"] || "",
      email: row["email"] || null,
      phone: row["phone"] || null,
      partyName: row["party_name"] || row["partyname"] || null,
      maxPlusOnes: Number(row["max_plus_ones"] || row["plusones"]) || 0,
    };
  });

  if (rows.length > 0) await db.insert(guests).values(rows);
  return { count: rows.length };
}
