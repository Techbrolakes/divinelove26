import { Resend } from "resend";
import { env } from "@repo/env";
import { VerificationOTPEmail } from "./templates/verification-otp";
import { WelcomeEmail } from "./templates/welcome";
import { InvitationEmail, type InvitationEvent } from "./templates/invitation";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(env.RESEND_API_KEY);
  }
  return _resend;
}

function getFromEmail(): string {
  return env.RESEND_FROM_EMAIL;
}

export async function sendVerificationOTP(
  email: string,
  otp: string,
  expiryMinutes = 15,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await getResend().emails.send({
      from: getFromEmail(),
      to: email,
      subject: `${otp} is your YourApp verification code`,
      react: VerificationOTPEmail({ otp, expiryMinutes }),
    });

    if (error) {
      console.error("[Email] Failed to send verification OTP:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[Email] Error sending verification OTP:", err);
    return { success: false, error: "Failed to send email" };
  }
}

export async function sendWelcomeEmail(
  email: string,
  firstName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await getResend().emails.send({
      from: getFromEmail(),
      to: email,
      subject: "Welcome to YourApp!",
      react: WelcomeEmail({ firstName }),
    });

    if (error) {
      console.error("[Email] Failed to send welcome email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[Email] Error sending welcome email:", err);
    return { success: false, error: "Failed to send email" };
  }
}

export interface SendInvitationParams {
  to: string;
  fullName: string;
  code: string;
  /** Absolute HTTPS URL to the QR PNG (e.g. https://rsvp.example.com/api/qr/123456). */
  qrImageUrl: string;
  events?: InvitationEvent[];
  monogramUrl?: string;
  rsvpUrl?: string;
}

export async function sendInvitationEmail({
  to,
  fullName,
  code,
  qrImageUrl,
  events,
  monogramUrl,
  rsvpUrl,
}: SendInvitationParams): Promise<{ success: boolean; error?: string }> {
  try {
    const firstName = fullName.trim().split(/\s+/)[0] ?? fullName;

    const { error } = await getResend().emails.send({
      from: getFromEmail(),
      to,
      subject: `${firstName}, you are cordially invited — Ikhioya & Idah, 20 June 2026`,
      react: InvitationEmail({
        fullName,
        code,
        qrImageUrl,
        events,
        monogramUrl,
        rsvpUrl,
      }),
    });

    if (error) {
      console.error("[Email] Failed to send invitation:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[Email] Error sending invitation:", err);
    return { success: false, error: "Failed to send invitation" };
  }
}
