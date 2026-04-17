import crypto from "crypto";
import { eq, and } from "drizzle-orm";
import type { Database } from "@repo/db";
import { verificationTokens } from "@repo/db/schema";

const OTP_EXPIRY_MINUTES = 15;

export function generateOTP(): string {
  const digits = "0123456789";
  let otp = "";
  const randomBytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    otp += digits[randomBytes[i]! % 10];
  }
  return otp;
}

export async function createOTP(
  db: Database,
  email: string,
  type: "email-verification" | "password-reset",
): Promise<string> {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await db.insert(verificationTokens).values({
    email: email.toLowerCase(),
    token: otp,
    type,
    expiresAt,
    used: false,
  });

  return otp;
}

export async function checkOTP(
  db: Database,
  email: string,
  otp: string,
  type: "email-verification" | "password-reset",
): Promise<{ valid: boolean; error?: string }> {
  const record = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.email, email.toLowerCase()),
      eq(verificationTokens.token, otp),
      eq(verificationTokens.type, type),
    ),
  });

  if (!record) {
    return { valid: false, error: "Invalid OTP" };
  }

  if (record.used) {
    return { valid: false, error: "OTP already used" };
  }

  if (new Date() > record.expiresAt) {
    return { valid: false, error: "OTP expired" };
  }

  return { valid: true };
}

export async function verifyOTP(
  db: Database,
  email: string,
  otp: string,
  type: "email-verification" | "password-reset",
): Promise<{ valid: boolean; error?: string }> {
  const record = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.email, email.toLowerCase()),
      eq(verificationTokens.token, otp),
      eq(verificationTokens.type, type),
    ),
  });

  if (!record) {
    return { valid: false, error: "Invalid OTP" };
  }

  if (record.used) {
    return { valid: false, error: "OTP already used" };
  }

  if (new Date() > record.expiresAt) {
    return { valid: false, error: "OTP expired" };
  }

  await db
    .update(verificationTokens)
    .set({ used: true, usedAt: new Date() })
    .where(eq(verificationTokens.id, record.id));

  return { valid: true };
}

export function getOTPExpiryMinutes(): number {
  return OTP_EXPIRY_MINUTES;
}
