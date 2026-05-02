import { Resend } from "resend";
import { env } from "@repo/env";
import { VerificationOTPEmail } from "./templates/verification-otp";
import { WelcomeEmail } from "./templates/welcome";
import { InvitationConfirmationEmail } from "./templates/invitation-confirmation";
import {
  renderInvitationPDF,
  type InvitationPDFEvent,
} from "./pdf/invitation-pdf";

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
  events?: InvitationPDFEvent[];
  rsvpUrl?: string;
  coupleNames?: string;
  weddingDateLabel?: string;
}

export async function sendInvitationEmail({
  to,
  fullName,
  code,
  events,
  rsvpUrl,
  coupleNames = "Idah & Ikhioya",
  weddingDateLabel = "Saturday, 20 June 2026",
}: SendInvitationParams): Promise<{ success: boolean; error?: string }> {
  try {
    const pdfBuffer = await renderInvitationPDF({
      fullName,
      code,
      events,
      coupleNames,
      weddingDateLabel,
    });

    const firstName = fullName.trim().split(/\s+/)[0] ?? fullName;
    const pdfFilename = `${firstName}-${coupleNames.replace(/[^a-zA-Z0-9]+/g, "-")}-invitation.pdf`;

    const { error } = await getResend().emails.send({
      from: getFromEmail(),
      to,
      subject: `Your invitation — ${coupleNames}, ${weddingDateLabel}`,
      react: InvitationConfirmationEmail({
        fullName,
        code,
        rsvpUrl,
        coupleNames,
        weddingDateLabel,
      }),
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
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
