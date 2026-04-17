import crypto from "crypto";
import { eq } from "drizzle-orm";
import type { Database } from "@repo/db";
import { sessions, users } from "@repo/db/schema";

const SESSION_EXPIRY_DAYS = 30;

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(
  db: Database,
  userId: string,
): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSessionToken();
  const expiresAt = new Date(
    Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  );

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  });

  return { token, expiresAt };
}

export async function validateSession(
  db: Database,
  token: string,
): Promise<{
  valid: boolean;
  user?: typeof users.$inferSelect;
  error?: string;
}> {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.token, token),
  });

  if (!session) {
    return { valid: false, error: "Invalid session" };
  }

  if (new Date() > session.expiresAt) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return { valid: false, error: "Session expired" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!user) {
    return { valid: false, error: "User not found" };
  }

  return { valid: true, user };
}

export async function deleteSession(
  db: Database,
  token: string,
): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function deleteAllUserSessions(
  db: Database,
  userId: string,
): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}
