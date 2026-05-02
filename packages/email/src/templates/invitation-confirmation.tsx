import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

interface InvitationConfirmationEmailProps {
  fullName: string;
  code: string;
  rsvpUrl?: string;
  coupleNames?: string;
  weddingDateLabel?: string;
}

const ROYAL = "#0b3d91";
const ROYAL_DARK = "#082a66";
const INK = "#1c1d22";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";

const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export function InvitationConfirmationEmail({
  fullName,
  code,
  rsvpUrl,
  coupleNames = "Idah & Ikhioya",
  weddingDateLabel = "Saturday, 20 June 2026",
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
        Your invitation to {coupleNames}&apos;s wedding — details attached
      </Preview>
      <Body style={body}>
        <Container style={wrapper}>
          <Section style={card}>
            <Section style={headerBlock}>
              <Text style={eyebrow}>#DIVINELOVE26</Text>
              <Text style={headline}>You are cordially invited</Text>
              <Text style={subhead}>
                {coupleNames} · {weddingDateLabel}
              </Text>
            </Section>

            <Text style={greeting}>Dear {firstName},</Text>
            <Text style={paragraph}>
              Thank you for registering for <strong>{coupleNames}</strong>
              &apos;s wedding on {weddingDateLabel}. We are delighted to have
              you with us.
            </Text>
            <Text style={paragraph}>
              Your personal invitation is attached to this email as a PDF. It
              contains your QR code, the schedule for the day, and the venue
              details. Please bring it with you — printed or on your phone — so
              we can check you in at the door.
            </Text>

            <Section style={codeBlock}>
              <Text style={codeLabel}>Your invitation code</Text>
              <Text style={codeValue}>{spacedCode}</Text>
              <Text style={codeHint}>
                Keep this private. If the PDF does not open, share this
                six-digit code at the door.
              </Text>
            </Section>

            {rsvpUrl ? (
              <Text style={paragraph}>
                You can also view your invitation online at{" "}
                <Link href={rsvpUrl} style={linkStyle}>
                  {rsvpUrl.replace(/^https?:\/\//, "")}
                </Link>
                .
              </Text>
            ) : null}

            <Text style={closing}>With love,</Text>
            <Text style={signature}>{coupleNames}</Text>
          </Section>

          <Section style={{ padding: "16px 8px", textAlign: "center" }}>
            <Text style={footnote}>
              You received this email because you registered for {coupleNames}
              &apos;s wedding.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default InvitationConfirmationEmail;

const body: React.CSSProperties = {
  backgroundColor: "#f5efe4",
  fontFamily: SANS,
  margin: 0,
  padding: "32px 0",
};

const wrapper: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "560px",
  width: "100%",
  padding: "0 20px",
};

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: `1px solid ${BORDER}`,
  borderTop: `6px solid ${ROYAL}`,
  borderRadius: "4px",
  padding: "28px 32px",
};

const headerBlock: React.CSSProperties = {
  textAlign: "center",
  padding: "4px 0 22px",
  borderBottom: `1px solid ${BORDER}`,
  marginBottom: "22px",
};

const eyebrow: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "4px",
  color: ROYAL,
  textTransform: "uppercase",
  fontWeight: 700,
  margin: "0 0 8px",
};

const headline: React.CSSProperties = {
  fontSize: "24px",
  color: ROYAL_DARK,
  margin: "0 0 6px",
  fontWeight: 600,
  fontStyle: "italic",
  fontFamily: '"Cormorant Garamond", Georgia, "Times New Roman", serif',
};

const subhead: React.CSSProperties = {
  fontSize: "12px",
  letterSpacing: "2px",
  color: MUTED,
  textTransform: "uppercase",
  fontWeight: 600,
  margin: 0,
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
  borderRadius: "4px",
  padding: "18px 20px",
  margin: "18px 0",
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
  fontSize: "28px",
  letterSpacing: "6px",
  color: ROYAL_DARK,
  margin: "0 0 8px",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
};

const codeHint: React.CSSProperties = {
  fontSize: "11.5px",
  color: MUTED,
  margin: 0,
  lineHeight: 1.5,
};

const linkStyle: React.CSSProperties = {
  color: ROYAL,
  textDecoration: "underline",
};

const closing: React.CSSProperties = {
  fontSize: "13px",
  color: MUTED,
  margin: "24px 0 2px",
};

const signature: React.CSSProperties = {
  fontSize: "16px",
  color: ROYAL,
  margin: 0,
  fontWeight: 600,
};

const footnote: React.CSSProperties = {
  fontSize: "11px",
  color: MUTED,
  margin: 0,
  lineHeight: 1.5,
};
