import { Resend } from "resend";
import { env } from "@repo/env";
import { VerificationOTPEmail } from "./templates/verification-otp";
import { WelcomeEmail } from "./templates/welcome";
import { InvitationConfirmationEmail } from "./templates/invitation-confirmation";
import {
  renderInvitationPDF,
  type InvitationPDFEvent,
} from "./pdf/invitation-pdf";
import {
  MONOGRAM_JPEG_BASE64,
  INVITATION_JPG_BASE64,
} from "./assets-data";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(env.RESEND_API_KEY);
  }
  return _resend;
}

function getFrom(): string {
  return `${env.RESEND_FROM_NAME} <${env.RESEND_FROM_EMAIL}>`;
}

let _monogramBuffer: Buffer | null = null;
function getMonogramBuffer(): Buffer {
  if (_monogramBuffer) return _monogramBuffer;
  _monogramBuffer = Buffer.from(MONOGRAM_JPEG_BASE64, "base64");
  return _monogramBuffer;
}

let _invitationBuffer: Buffer | null = null;
function getInvitationBuffer(): Buffer {
  if (_invitationBuffer) return _invitationBuffer;
  _invitationBuffer = Buffer.from(INVITATION_JPG_BASE64, "base64");
  return _invitationBuffer;
}

const MONOGRAM_CID = "divinelove26-monogram";

interface SendResult {
  success: boolean;
  error?: string;
}

function describeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown email error";
  }
}

function inlineMonogramAttachment(buffer: Buffer) {
  return {
    filename: "monogram.jpeg",
    content: buffer,
    contentType: "image/jpeg",
    // content_id lets the HTML reference this part as `cid:divinelove26-monogram`.
    content_id: MONOGRAM_CID,
  };
}

export async function sendVerificationOTP(
  email: string,
  otp: string,
  expiryMinutes = 15,
): Promise<SendResult> {
  try {
    const monogram = await getMonogramBuffer();

    const { error } = await getResend().emails.send({
      from: getFrom(),
      to: email,
      subject: `${otp} is your Divine Love 26 verification code`,
      react: VerificationOTPEmail({
        otp,
        expiryMinutes,
        monogramCid: MONOGRAM_CID,
      }),
      attachments: [inlineMonogramAttachment(monogram)],
    });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("[Email] Error sending verification OTP:", err);
    return { success: false, error: describeError(err) };
  }
}

export async function sendWelcomeEmail(
  email: string,
  firstName: string,
): Promise<SendResult> {
  try {
    const monogram = await getMonogramBuffer();

    const { error } = await getResend().emails.send({
      from: getFrom(),
      to: email,
      subject: "Welcome to Divine Love 26",
      react: WelcomeEmail({ firstName, monogramCid: MONOGRAM_CID }),
      attachments: [inlineMonogramAttachment(monogram)],
    });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("[Email] Error sending welcome email:", err);
    return { success: false, error: describeError(err) };
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
}: SendInvitationParams): Promise<SendResult> {
  try {
    const [invitationImage, pdfBuffer] = await Promise.all([
      getInvitationBuffer(),
      renderInvitationPDF({
        fullName,
        code,
        events,
        coupleNames,
        weddingDateLabel,
      }),
    ]);

    const firstName = fullName.trim().split(/\s+/)[0] ?? fullName;
    const slug = coupleNames.replace(/[^a-zA-Z0-9]+/g, "-");
    const pdfFilename = `${firstName}-${slug}-pass.pdf`;
    const jpgFilename = `${firstName}-${slug}-invitation.jpg`;

    const { error } = await getResend().emails.send({
      from: getFrom(),
      to,
      subject: `Your invitation — ${coupleNames}, ${weddingDateLabel}`,
      react: InvitationConfirmationEmail({
        fullName,
        code,
        rsvpUrl,
        coupleNames,
        weddingDateLabel,
        events,
      }),
      attachments: [
        {
          filename: jpgFilename,
          content: invitationImage,
          contentType: "image/jpeg",
        },
        {
          filename: pdfFilename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("[Email] Error sending invitation:", err);
    return { success: false, error: describeError(err) };
  }
}
