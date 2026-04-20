import { asc, count, eq, sql } from "drizzle-orm";
import type { Database } from "@repo/db";
import { guests } from "@repo/db/schema";
import { sendInvitationEmail } from "@repo/email";
import { badRequest, conflict, notFound, serverError } from "../../errors";

const RSVP_URL = process.env["NEXT_PUBLIC_RSVP_URL"];

export async function getStats(db: Database) {
  const [row] = await db
    .select({
      total: count(),
      invited: sql<number>`count(${guests.invitationSentAt})`.mapWith(Number),
      checkedIn: sql<number>`count(${guests.checkedInAt})`.mapWith(Number),
    })
    .from(guests);

  const total = row?.total ?? 0;
  const invited = row?.invited ?? 0;

  return {
    total,
    invited,
    checkedIn: row?.checkedIn ?? 0,
    pending: total - invited,
  };
}

export async function getGuests(db: Database) {
  return db
    .select({
      id: guests.id,
      fullName: guests.fullName,
      email: guests.email,
      invitationSentAt: guests.invitationSentAt,
      checkedInAt: guests.checkedInAt,
      createdAt: guests.createdAt,
    })
    .from(guests)
    .orderBy(asc(guests.createdAt));
}

export async function deleteGuest(db: Database, guestId: string) {
  await db.delete(guests).where(eq(guests.id, guestId));
  return { success: true };
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function generateUniqueCode(db: Database): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateCode();
    const existing = await db.query.guests.findFirst({
      where: eq(guests.invitationCode, code),
      columns: { id: true },
    });
    if (!existing) return code;
  }
  serverError("Could not generate a unique invitation code");
}

export async function sendInvitation(db: Database, guestId: string) {
  const guest = await db.query.guests.findFirst({
    where: eq(guests.id, guestId),
  });
  if (!guest) notFound("Guest");

  const code = guest.invitationCode ?? (await generateUniqueCode(db));

  const dayEvents = await db.query.events.findMany({
    orderBy: (e, { asc }) => [asc(e.sortOrder), asc(e.date)],
  });

  const result = await sendInvitationEmail({
    to: guest.email,
    fullName: guest.fullName,
    code,
    events: dayEvents.map((e) => ({
      name: e.name,
      date: e.date,
      endTime: e.endTime,
      venueName: e.venueName,
      venueAddress: e.venueAddress,
      dressCode: e.dressCode,
      description: e.description,
    })),
    rsvpUrl: RSVP_URL,
  });

  if (!result.success) {
    serverError(result.error ?? "Failed to send invitation email");
  }

  const [updated] = await db
    .update(guests)
    .set({
      invitationCode: code,
      invitationSentAt: new Date(),
    })
    .where(eq(guests.id, guestId))
    .returning({
      id: guests.id,
      invitationCode: guests.invitationCode,
      invitationSentAt: guests.invitationSentAt,
    });

  if (!updated) serverError("Failed to record invitation");

  return updated;
}

export async function validateCode(db: Database, code: string) {
  const guest = await db.query.guests.findFirst({
    where: eq(guests.invitationCode, code),
  });

  if (!guest) badRequest("No invitation matches this code.");
  if (!guest.invitationSentAt) {
    badRequest("Invitation has not been sent for this guest.");
  }
  if (guest.checkedInAt) {
    conflict(`${guest.fullName} has already checked in.`);
  }

  const [updated] = await db
    .update(guests)
    .set({ checkedInAt: new Date() })
    .where(eq(guests.id, guest.id))
    .returning({
      id: guests.id,
      fullName: guests.fullName,
      email: guests.email,
      checkedInAt: guests.checkedInAt,
    });

  if (!updated) serverError("Failed to mark check-in");

  return updated;
}
