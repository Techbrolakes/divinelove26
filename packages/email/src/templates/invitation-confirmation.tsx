import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import type { InvitationPDFEvent } from "../pdf/invitation-pdf";

interface InvitationConfirmationEmailProps {
  fullName: string;
  code: string;
  rsvpUrl?: string;
  coupleNames?: string;
  weddingDateLabel?: string;
  events?: InvitationPDFEvent[];
  /** Content-ID for the inline monogram image (matches the inline_image cid). */
  monogramCid?: string;
}

const ROYAL = "#0b3d91";
const ROYAL_DARK = "#04123a";
const ROYAL_DEEP = "#061a43";
const GOLD = "#a8b4c4";
const GOLD_LIGHT = "#c5cdd8";
const PAPER = "#f5efe4";
const INK = "#1c1d22";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";

const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const SERIF = '"Cormorant Garamond", Georgia, "Times New Roman", serif';

function formatDate(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatTime(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function InvitationConfirmationEmail({
  fullName,
  code,
  rsvpUrl,
  coupleNames = "Idah & Ikhioya",
  weddingDateLabel = "Saturday, 20 June 2026",
  events,
  monogramCid,
}: InvitationConfirmationEmailProps) {
  const firstName = fullName.trim().split(/\s+/)[0] ?? fullName;
  const spacedCode = code.replace(/(\d{3})(\d{3})/, "$1 $2");

  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light only" />
      </Head>
      <Preview>
        Your invitation to {coupleNames}&apos;s wedding — details inside
      </Preview>
      <Body style={body}>
        <Container style={wrapper}>
          {/* Royal hero with monogram */}
          <Section style={hero}>
            <Text style={heroEyebrow}>#DIVINELOVE26</Text>
            <Text style={heroTitle}>You are cordially invited</Text>
            <Text style={heroSubhead}>{coupleNames}</Text>
            <Text style={heroDate}>{weddingDateLabel}</Text>
          </Section>

          {/* Card body */}
          <Section style={card}>
            <Text style={greeting}>Dear {firstName},</Text>
            <Text style={paragraph}>
              We are delighted to invite you to the wedding of{" "}
              <strong>{coupleNames}</strong> on {weddingDateLabel}. Your
              presence will be the greatest gift.
            </Text>
            <Text style={paragraph}>
              Two files are attached to this email: the formal{" "}
              <strong>invitation</strong> (image) with venue details, and a{" "}
              <strong>QR pass</strong> (PDF) for entry on the day. Please bring
              the QR pass with you — printed or on your phone — so we can check
              you in at the door.
            </Text>

            <Section style={codeBlock}>
              <Text style={codeLabel}>Your invitation code</Text>
              <Text style={codeValue}>{spacedCode}</Text>
              <Text style={codeHint}>
                Keep this private. If the attached invitation does not open,
                this code is all you need at the door.
              </Text>
            </Section>

            <Hr style={hairline} />

            <Text style={closing}>With love,</Text>
            <Text style={signature}>{coupleNames}</Text>
          </Section>

          <Section style={footer}>
            <Text style={footnote}>
              You received this invitation because you were registered for{" "}
              {coupleNames}&apos;s wedding.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default InvitationConfirmationEmail;

const body: React.CSSProperties = {
  backgroundColor: PAPER,
  fontFamily: SANS,
  margin: 0,
  padding: "32px 0",
};

const wrapper: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "600px",
  width: "100%",
  padding: "0 16px",
};

const hero: React.CSSProperties = {
  background: `linear-gradient(160deg, ${ROYAL_DEEP} 0%, ${ROYAL_DARK} 100%)`,
  backgroundColor: ROYAL_DARK,
  textAlign: "center",
  padding: "36px 24px 30px",
  borderRadius: "6px 6px 0 0",
  borderTop: `4px solid ${GOLD}`,
};

const monogramImg: React.CSSProperties = {
  display: "block",
  margin: "0 auto 14px",
  borderRadius: "50%",
  border: `1px solid ${GOLD}`,
};

const heroEyebrow: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "5px",
  color: GOLD_LIGHT,
  textTransform: "uppercase",
  fontWeight: 600,
  margin: "0 0 12px",
};

const heroTitle: React.CSSProperties = {
  fontSize: "26px",
  color: "#ffffff",
  margin: "0 0 10px",
  fontStyle: "italic",
  fontFamily: SERIF,
  fontWeight: 400,
};

const heroSubhead: React.CSSProperties = {
  fontSize: "20px",
  fontFamily: SERIF,
  color: GOLD_LIGHT,
  fontStyle: "italic",
  margin: "0 0 6px",
};

const heroDate: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "3px",
  color: "#ffffff",
  opacity: 0.8,
  textTransform: "uppercase",
  fontWeight: 600,
  margin: 0,
};

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: `1px solid ${BORDER}`,
  borderTop: 0,
  borderRadius: "0 0 6px 6px",
  padding: "28px 32px 24px",
};

const greeting: React.CSSProperties = {
  fontSize: "18px",
  color: ROYAL_DARK,
  margin: "0 0 12px",
  fontWeight: 600,
};

const paragraph: React.CSSProperties = {
  fontSize: "14.5px",
  lineHeight: 1.65,
  color: INK,
  margin: "0 0 14px",
};

const codeBlock: React.CSSProperties = {
  backgroundColor: "#faf6ef",
  border: `1px solid ${BORDER}`,
  borderRadius: "6px",
  padding: "20px 22px",
  margin: "20px 0",
  textAlign: "center",
};

const codeLabel: React.CSSProperties = {
  fontSize: "10px",
  letterSpacing: "3px",
  color: MUTED,
  textTransform: "uppercase",
  margin: "0 0 6px",
  fontWeight: 600,
};

const codeValue: React.CSSProperties = {
  fontSize: "30px",
  letterSpacing: "8px",
  color: ROYAL,
  margin: "0 0 8px",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  fontFamily: SANS,
};

const codeHint: React.CSSProperties = {
  fontSize: "11.5px",
  color: MUTED,
  margin: 0,
  lineHeight: 1.5,
};

const schedule: React.CSSProperties = {
  margin: "20px 0 4px",
};

const scheduleHeading: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "4px",
  color: ROYAL,
  textTransform: "uppercase",
  fontWeight: 700,
  margin: "0 0 10px",
};

const scheduleRow: React.CSSProperties = {
  borderTop: `1px solid ${BORDER}`,
  padding: "12px 0",
};

const scheduleRowFirst: React.CSSProperties = {
  ...scheduleRow,
  borderTop: 0,
  paddingTop: 0,
};

const scheduleName: React.CSSProperties = {
  fontSize: "16px",
  fontFamily: SERIF,
  fontStyle: "italic",
  color: ROYAL_DARK,
  margin: "0 0 4px",
  fontWeight: 600,
};

const scheduleWhen: React.CSSProperties = {
  fontSize: "13px",
  color: INK,
  margin: "0 0 3px",
  fontWeight: 500,
};

const scheduleWhere: React.CSSProperties = {
  fontSize: "12.5px",
  color: MUTED,
  margin: "0 0 3px",
  lineHeight: 1.5,
};

const scheduleMeta: React.CSSProperties = {
  fontSize: "11.5px",
  color: MUTED,
  margin: "0 0 3px",
  letterSpacing: "0.5px",
};

const scheduleDesc: React.CSSProperties = {
  fontSize: "12.5px",
  color: INK,
  margin: "4px 0 0",
  lineHeight: 1.55,
};

const ctaWrap: React.CSSProperties = {
  margin: "22px 0 8px",
  textAlign: "center",
};

const ctaButton: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: ROYAL,
  color: "#ffffff",
  textDecoration: "none",
  padding: "12px 28px",
  fontSize: "12px",
  letterSpacing: "3px",
  textTransform: "uppercase",
  fontWeight: 600,
  borderRadius: "999px",
};

const ctaHint: React.CSSProperties = {
  fontSize: "12px",
  color: MUTED,
  margin: "10px 0 0",
};

const inlineLink: React.CSSProperties = {
  color: ROYAL,
  textDecoration: "underline",
};

const hairline: React.CSSProperties = {
  border: 0,
  borderTop: `1px solid ${BORDER}`,
  margin: "24px 0 16px",
};

const closing: React.CSSProperties = {
  fontSize: "13px",
  color: MUTED,
  margin: "0 0 2px",
};

const signature: React.CSSProperties = {
  fontSize: "20px",
  fontFamily: SERIF,
  fontStyle: "italic",
  color: ROYAL,
  margin: 0,
  fontWeight: 500,
};

const footer: React.CSSProperties = {
  padding: "16px 8px",
  textAlign: "center",
};

const footnote: React.CSSProperties = {
  fontSize: "11px",
  color: MUTED,
  margin: 0,
  lineHeight: 1.5,
};
