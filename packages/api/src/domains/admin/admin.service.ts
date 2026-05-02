import { and, count, desc, eq, ne, sql } from "drizzle-orm";
import type { Database } from "@repo/db";
import { guests, users } from "@repo/db/schema";
import { sendInvitationEmail } from "@repo/email";
import { hashPassword } from "@repo/auth";
import { badRequest, conflict, notFound, serverError } from "../../errors";
import type { CreateAdminInput } from "./admin.schema";

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
    .orderBy(desc(guests.createdAt));
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

export async function listAdmins(db: Database) {
  return db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.role, "admin"))
    .orderBy(desc(users.createdAt));
}

export async function createAdmin(
  db: Database,
  currentAdminId: string,
  input: CreateAdminInput,
) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });
  if (existing) {
    conflict("An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);

  let created;
  try {
    const [row] = await db
      .insert(users)
      .values({
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: "admin",
        isEmailVerified: true,
      })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      });
    created = row;
  } catch (err: unknown) {
    const pgError = err as { code?: string; message?: string };
    if (pgError?.code === "23505" || pgError?.message?.includes("unique")) {
      conflict("An account with this email already exists");
    }
    throw err;
  }

  if (!created) {
    serverError("Failed to create admin");
  }
  // Suppress unused warnings — kept for future audit/log use.
  void currentAdminId;
  return created;
}

export async function deleteAdmin(
  db: Database,
  currentAdminId: string,
  adminId: string,
) {
  if (adminId === currentAdminId) {
    badRequest("You cannot remove your own account");
  }

  const target = await db.query.users.findFirst({
    where: and(eq(users.id, adminId), eq(users.role, "admin")),
  });
  if (!target) notFound("Admin");

  // Make sure at least one admin remains.
  const [remaining] = await db
    .select({ value: count() })
    .from(users)
    .where(and(eq(users.role, "admin"), ne(users.id, adminId)));

  if ((remaining?.value ?? 0) < 1) {
    badRequest("At least one admin must remain");
  }

  await db.delete(users).where(eq(users.id, adminId));

  return { success: true };
}
