import { eq } from "drizzle-orm";
import type { Database } from "@repo/db";
import type { User } from "@repo/db/schema";
import { users } from "@repo/db/schema";
import { hashPassword, verifyPassword, createOTP, verifyOTP } from "@repo/auth";
import { createSession, deleteSession } from "@repo/auth/session";
import { enqueueEmail } from "../../lib/enqueue";
import {
  notFound,
  forbidden,
  badRequest,
  conflict,
  unauthorized,
  serverError,
} from "../../errors";
import type {
  SignupInput,
  LoginInput,
  VerifyOtpInput,
  ResendOtpInput,
  UpdateProfileInput,
} from "./auth.schema";

export async function signup(db: Database, input: SignupInput) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (existing) {
    conflict("An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);

  let user;
  try {
    const [created] = await db
      .insert(users)
      .values({
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: "user",
        isEmailVerified: false,
      })
      .returning();
    user = created;
  } catch (err: unknown) {
    const pgError = err as { code?: string; message?: string };
    if (pgError?.code === "23505" || pgError?.message?.includes("unique")) {
      conflict("An account with this email already exists");
    }
    throw err;
  }

  if (!user) {
    serverError("Failed to create account");
  }

  const otp = await createOTP(db, input.email, "email-verification");

  enqueueEmail({
    type: "send-verification-otp",
    email: input.email,
    otp,
  });

  return {
    success: true,
    message: "Account created. Please verify your email.",
  };
}

export async function login(db: Database, input: LoginInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (!user) {
    unauthorized("Invalid email or password");
  }

  const isValid = await verifyPassword(input.password, user.passwordHash);
  if (!isValid) {
    unauthorized("Invalid email or password");
  }

  if (!user.isEmailVerified) {
    forbidden("Please verify your email before logging in");
  }

  const session = await createSession(db, user.id);

  return {
    success: true,
    token: session.token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}

export async function verifyOtp(db: Database, input: VerifyOtpInput) {
  const otpResult = await verifyOTP(
    db,
    input.email,
    input.otp,
    "email-verification",
  );

  if (!otpResult.valid) {
    badRequest(otpResult.error || "Invalid verification code");
  }

  // Mark email as verified
  const [user] = await db
    .update(users)
    .set({ isEmailVerified: true, updatedAt: new Date() })
    .where(eq(users.email, input.email))
    .returning();

  if (!user) {
    notFound("User");
  }

  // Create session so user is logged in after verification
  const session = await createSession(db, user.id);

  enqueueEmail({
    type: "send-welcome-email",
    email: input.email,
    firstName: user.firstName,
  });

  return {
    success: true,
    token: session.token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}

export async function resendOtp(db: Database, input: ResendOtpInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (!user) {
    // Don't reveal whether the email exists
    return { success: true, message: "If an account exists, a code has been sent" };
  }

  if (user.isEmailVerified) {
    badRequest("Email is already verified");
  }

  const otp = await createOTP(db, input.email, "email-verification");

  enqueueEmail({
    type: "send-verification-otp",
    email: input.email,
    otp,
  });

  return { success: true, message: "Verification code sent" };
}

export function getProfile(user: User) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    avatar: user.avatar,
    phoneNumber: user.phoneNumber,
    isEmailVerified: user.isEmailVerified,
  };
}

export async function updateProfile(
  db: Database,
  user: User,
  input: UpdateProfileInput,
) {
  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (input.firstName !== undefined) updateData.firstName = input.firstName;
  if (input.lastName !== undefined) updateData.lastName = input.lastName;
  if (input.phoneNumber !== undefined) updateData.phoneNumber = input.phoneNumber;
  if (input.avatar !== undefined) updateData.avatar = input.avatar;

  const [updated] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, user.id))
    .returning();

  if (!updated) {
    serverError("Failed to update profile");
  }

  return {
    id: updated.id,
    email: updated.email,
    firstName: updated.firstName,
    lastName: updated.lastName,
    role: updated.role,
    avatar: updated.avatar,
    phoneNumber: updated.phoneNumber,
    isEmailVerified: updated.isEmailVerified,
  };
}

export async function logout(db: Database, sessionToken: string | null) {
  if (sessionToken) {
    await deleteSession(db, sessionToken);
  }
  return { success: true };
}
