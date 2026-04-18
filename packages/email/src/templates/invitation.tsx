import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export interface InvitationEvent {
  name: string;
  date: Date | string;
  endTime?: Date | string | null;
  venueName: string;
  venueAddress?: string | null;
  dressCode?: string | null;
  description?: string | null;
}

interface InvitationEmailProps {
  fullName: string;
  code: string;
  /** Public HTTPS URL to a PNG of the QR code. Gmail & Outlook strip data URLs. */
  qrImageUrl: string;
  events?: InvitationEvent[];
  monogramUrl?: string;
  rsvpUrl?: string;
}

// Palette
const ROYAL = "#0b3d91";
const ROYAL_DARK = "#082a66";
const ROYAL_LIGHT = "#1a56c4";
const ROYAL_50 = "#eef3fb";
const IVORY = "#faf6ef";
const CREAM = "#f5efe4";
const INK = "#1c1d22";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";

const SERIF =
  '"Cormorant Garamond", "Playfair Display", Georgia, "Times New Roman", serif';
const SANS =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const formatTime = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export function InvitationEmail({
  fullName,
  code,
  qrImageUrl,
  events = [],
  monogramUrl,
  rsvpUrl,
}: InvitationEmailProps) {
  const firstName = fullName.trim().split(/\s+/)[0] ?? fullName;

  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <Font
          fontFamily="Cormorant Garamond"
          fallbackFontFamily={["Georgia", "Times New Roman", "serif"]}
          webFont={{
            url: "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYrEPjpA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Cormorant Garamond"
          fallbackFontFamily={["Georgia", "Times New Roman", "serif"]}
          webFont={{
            url: "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3WmX5slCNuHLi8bLeY9MK7whWMhyjQrkHjpA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="italic"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        Dear {firstName} — you are cordially invited to Ikhioya &amp; Idah&apos;s
        wedding · code {code.replace(/(\d{3})(\d{3})/, "$1 $2")}
      </Preview>
      <Body style={body}>
        <Container style={wrapper}>
          {/* Outer stationery frame */}
          <Container style={envelope}>
            {/* Top accent */}
            <div style={accentBar} />

            {/* Postmark / overline */}
            <Section style={{ padding: "40px 48px 0", textAlign: "center" }}>
              <Text style={postmark}>
                &middot; You are cordially invited &middot;
              </Text>
            </Section>

            {/* Monogram / couple */}
            <Section style={{ padding: "20px 48px 0", textAlign: "center" }}>
              {monogramUrl ? (
                <Img
                  src={monogramUrl}
                  alt="Divine Love 26 monogram"
                  width={96}
                  height={96}
                  style={monogramImg}
                />
              ) : (
                <Text style={monogramText}>DL</Text>
              )}

              <Text style={overline}>The wedding of</Text>

              <Text style={coupleLine}>
                Ikhioya&nbsp;David
                <span style={ampersand}>&nbsp;&amp;&nbsp;</span>
                Idah&nbsp;Joy
              </Text>

              {/* Flourish */}
              <table
                role="presentation"
                cellPadding={0}
                cellSpacing={0}
                border={0}
                align="center"
                style={{ margin: "20px auto" }}
              >
                <tbody>
                  <tr>
                    <td style={flourishLine} />
                    <td style={flourishDot}>&#10086;</td>
                    <td style={flourishLine} />
                  </tr>
                </tbody>
              </table>

              <Text style={dateHeadline}>
                Saturday, 20&nbsp;&middot;&nbsp;June&nbsp;&middot;&nbsp;2026
              </Text>
            </Section>

            {/* Personal note */}
            <Section style={{ padding: "36px 48px 0" }}>
              <Text style={greeting}>Dear&nbsp;{firstName},</Text>
              <Text style={paragraph}>
                It is with joyful hearts that we invite you to share in the
                celebration of our marriage. Your presence would be the most
                meaningful gift of our day.
              </Text>
            </Section>

            {/* Events */}
            {events.length > 0 && (
              <Section style={{ padding: "8px 48px 0" }}>
                <Text style={sectionLabel}>The day at a glance</Text>
                {events.map((event, i) => (
                  <Section
                    key={i}
                    style={{
                      ...eventCard,
                      marginTop: i === 0 ? 0 : 14,
                    }}
                  >
                    <Row>
                      <Column style={{ width: "70px", verticalAlign: "top" }}>
                        <div style={eventTimePill}>
                          <Text style={eventTimeText}>
                            {formatTime(event.date)}
                          </Text>
                        </div>
                      </Column>
                      <Column style={{ verticalAlign: "top", paddingLeft: 4 }}>
                        <Text style={eventName}>{event.name}</Text>
                        <Text style={eventVenue}>
                          {event.venueName}
                          {event.venueAddress ? (
                            <>
                              <br />
                              <span style={eventAddress}>
                                {event.venueAddress}
                              </span>
                            </>
                          ) : null}
                        </Text>
                        {event.dressCode ? (
                          <Text style={eventMeta}>
                            <span style={metaLabel}>Attire&nbsp;</span>
                            {event.dressCode}
                          </Text>
                        ) : null}
                      </Column>
                    </Row>
                  </Section>
                ))}
              </Section>
            )}

            {/* Ticket / code section */}
            <Section style={{ padding: "36px 48px 0" }}>
              <Text style={sectionLabel}>Your personal code</Text>

              <Section style={ticket}>
                {/* Inner ticket stub */}
                <Row>
                  <Column style={{ padding: "32px 28px", textAlign: "center" }}>
                    <Text style={ticketCaption}>Present at the door</Text>
                    <Text style={ticketCodeLabel}>Invitation code</Text>
                    <Text style={ticketCode}>
                      {code.replace(/(\d{3})(\d{3})/, "$1 $2")}
                    </Text>

                    <table
                      role="presentation"
                      cellPadding={0}
                      cellSpacing={0}
                      border={0}
                      align="center"
                      style={{ margin: "12px auto 18px" }}
                    >
                      <tbody>
                        <tr>
                          <td style={ticketDivider} />
                        </tr>
                      </tbody>
                    </table>

                    <Img
                      src={qrImageUrl}
                      alt={`Invitation QR code ${code}`}
                      width={200}
                      height={200}
                      style={qrImg}
                    />
                    <Text style={ticketHint}>
                      Scan the QR on your phone at the door, or share the
                      six-digit code.
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Text style={ticketFootnote}>
                This code is tied to your name&nbsp;—&nbsp;please keep it
                private.
              </Text>
            </Section>

            {/* RSVP link button */}
            {rsvpUrl ? (
              <Section style={{ padding: "28px 48px 0", textAlign: "center" }}>
                <table
                  role="presentation"
                  cellPadding={0}
                  cellSpacing={0}
                  border={0}
                  align="center"
                  style={{ margin: "0 auto" }}
                >
                  <tbody>
                    <tr>
                      <td style={ctaWrap}>
                        <a href={rsvpUrl} style={ctaButton}>
                          View invitation online &rarr;
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>
            ) : null}

            {/* Closing */}
            <Section style={{ padding: "40px 48px 16px", textAlign: "center" }}>
              <table
                role="presentation"
                cellPadding={0}
                cellSpacing={0}
                border={0}
                align="center"
                style={{ margin: "0 auto 16px" }}
              >
                <tbody>
                  <tr>
                    <td style={flourishLine} />
                    <td style={flourishDot}>&#10086;</td>
                    <td style={flourishLine} />
                  </tr>
                </tbody>
              </table>
              <Text style={closingLine}>With love and anticipation,</Text>
              <Text style={signature}>Ikhioya &amp; Idah</Text>
            </Section>

            {/* Footer band */}
            <Section style={footerBand}>
              <Text style={footerHashtag}>&#35;DIVINELOVE26</Text>
              <Text style={footerMeta}>
                20 &middot; June &middot; 2026 &nbsp;·&nbsp; A celebration of
                love
              </Text>
            </Section>
          </Container>

          {/* Very bottom meta */}
          <Section style={{ padding: "16px 24px", textAlign: "center" }}>
            <Text style={envelopeFootnote}>
              You received this invitation because you registered for Ikhioya
              &amp; Idah&apos;s wedding.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default InvitationEmail;

// ---------- Styles ----------

const body: React.CSSProperties = {
  backgroundColor: CREAM,
  fontFamily: SERIF,
  margin: 0,
  padding: "40px 0",
  WebkitFontSmoothing: "antialiased",
};

const wrapper: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "640px",
  width: "100%",
  padding: "0 20px",
};

const envelope: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "4px",
  overflow: "hidden",
  boxShadow:
    "0 2px 6px rgba(8, 42, 102, 0.08), 0 30px 60px -20px rgba(8, 42, 102, 0.18)",
  border: `1px solid ${BORDER}`,
};

const accentBar: React.CSSProperties = {
  height: "6px",
  background: `linear-gradient(90deg, ${ROYAL} 0%, ${ROYAL_LIGHT} 50%, ${ROYAL} 100%)`,
  backgroundColor: ROYAL,
};

const postmark: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "11px",
  letterSpacing: "5px",
  textTransform: "uppercase" as const,
  color: MUTED,
  margin: 0,
};

const monogramImg: React.CSSProperties = {
  display: "block",
  margin: "24px auto 12px",
  borderRadius: "50%",
  border: `1px solid ${ROYAL_50}`,
  padding: "4px",
  backgroundColor: "#ffffff",
};

const monogramText: React.CSSProperties = {
  display: "inline-block",
  margin: "24px auto 12px",
  width: "72px",
  height: "72px",
  lineHeight: "72px",
  borderRadius: "50%",
  backgroundColor: ROYAL,
  color: "#ffffff",
  fontFamily: SERIF,
  fontStyle: "italic" as const,
  fontSize: "30px",
  letterSpacing: "2px",
  textAlign: "center" as const,
};

const overline: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "10px",
  letterSpacing: "5px",
  textTransform: "uppercase" as const,
  color: MUTED,
  margin: "18px 0 8px",
};

const coupleLine: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: "38px",
  lineHeight: "1.1",
  fontWeight: 400,
  fontStyle: "italic" as const,
  color: ROYAL_DARK,
  margin: "0 0 4px",
  letterSpacing: "0.5px",
};

const ampersand: React.CSSProperties = {
  color: ROYAL,
  fontSize: "30px",
  fontStyle: "italic" as const,
  fontWeight: 300,
};

const flourishLine: React.CSSProperties = {
  width: "60px",
  height: "1px",
  background: `linear-gradient(90deg, transparent, ${ROYAL_50}, transparent)`,
  backgroundColor: ROYAL_50,
};

const flourishDot: React.CSSProperties = {
  padding: "0 10px",
  color: ROYAL,
  fontSize: "14px",
  verticalAlign: "middle" as const,
};

const dateHeadline: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "12px",
  letterSpacing: "4px",
  textTransform: "uppercase" as const,
  color: ROYAL_DARK,
  margin: "8px 0 0",
  fontWeight: 600,
};

const greeting: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: "22px",
  fontStyle: "italic" as const,
  color: ROYAL_DARK,
  margin: "0 0 14px",
  textAlign: "left" as const,
};

const paragraph: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "14.5px",
  lineHeight: "1.7",
  color: "#4a4f57",
  margin: "0 0 12px",
  textAlign: "left" as const,
};

const sectionLabel: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "10px",
  letterSpacing: "4px",
  textTransform: "uppercase" as const,
  color: MUTED,
  margin: "0 0 14px",
  fontWeight: 600,
  textAlign: "center" as const,
};

const eventCard: React.CSSProperties = {
  backgroundColor: IVORY,
  border: `1px solid ${ROYAL_50}`,
  borderLeft: `3px solid ${ROYAL}`,
  borderRadius: "4px",
  padding: "18px 20px",
};

const eventTimePill: React.CSSProperties = {
  backgroundColor: ROYAL,
  color: "#ffffff",
  borderRadius: "999px",
  padding: "6px 10px",
  textAlign: "center" as const,
  minWidth: 60,
};

const eventTimeText: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.5px",
  color: "#ffffff",
  margin: 0,
  lineHeight: "1",
};

const eventName: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: "20px",
  fontWeight: 500,
  color: ROYAL_DARK,
  margin: "0 0 4px",
  lineHeight: "1.2",
};

const eventVenue: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "13px",
  color: INK,
  margin: "0 0 6px",
  lineHeight: "1.5",
};

const eventAddress: React.CSSProperties = {
  color: MUTED,
  fontSize: "12px",
};

const eventMeta: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "12px",
  color: MUTED,
  margin: 0,
};

const metaLabel: React.CSSProperties = {
  fontSize: "10px",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  color: ROYAL,
  fontWeight: 600,
};

const ticket: React.CSSProperties = {
  backgroundColor: IVORY,
  borderRadius: "6px",
  border: `1px dashed ${ROYAL}`,
  margin: "6px 0 10px",
  overflow: "hidden",
  position: "relative" as const,
};

const ticketCaption: React.CSSProperties = {
  fontFamily: SERIF,
  fontStyle: "italic" as const,
  fontSize: "14px",
  color: ROYAL,
  margin: "0 0 14px",
};

const ticketCodeLabel: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "10px",
  letterSpacing: "4px",
  textTransform: "uppercase" as const,
  color: MUTED,
  margin: "0 0 6px",
  fontWeight: 600,
};

const ticketCode: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "40px",
  fontWeight: 700,
  letterSpacing: "8px",
  color: ROYAL_DARK,
  margin: "0 0 4px",
  lineHeight: "1.1",
  fontVariantNumeric: "tabular-nums",
};

const ticketDivider: React.CSSProperties = {
  width: "160px",
  height: "1px",
  background: `linear-gradient(90deg, transparent, ${ROYAL_50} 30%, ${ROYAL_50} 70%, transparent)`,
  backgroundColor: ROYAL_50,
};

const qrImg: React.CSSProperties = {
  display: "block",
  margin: "8px auto 14px",
  borderRadius: "6px",
  border: `1px solid ${ROYAL_50}`,
  padding: "8px",
  backgroundColor: "#ffffff",
};

const ticketHint: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "12px",
  fontStyle: "italic" as const,
  color: MUTED,
  margin: "0 auto",
  maxWidth: "360px",
  lineHeight: "1.5",
};

const ticketFootnote: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "11px",
  fontStyle: "italic" as const,
  color: MUTED,
  textAlign: "center" as const,
  margin: "10px 0 0",
};

const ctaWrap: React.CSSProperties = {
  borderRadius: "999px",
  backgroundColor: ROYAL,
};

const ctaButton: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 32px",
  fontFamily: SANS,
  fontSize: "11px",
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
  textDecoration: "none",
  color: "#ffffff",
  fontWeight: 600,
  borderRadius: "999px",
  background: `linear-gradient(135deg, ${ROYAL} 0%, ${ROYAL_DARK} 100%)`,
  backgroundColor: ROYAL,
  boxShadow: "0 8px 20px -8px rgba(11, 61, 145, 0.5)",
};

const closingLine: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "13px",
  color: MUTED,
  margin: "0 0 6px",
  fontStyle: "italic" as const,
};

const signature: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: "30px",
  fontStyle: "italic" as const,
  color: ROYAL,
  margin: "0",
  lineHeight: "1.1",
};

const footerBand: React.CSSProperties = {
  marginTop: "24px",
  padding: "22px 48px",
  backgroundColor: ROYAL_DARK,
  textAlign: "center" as const,
};

const footerHashtag: React.CSSProperties = {
  fontFamily: SERIF,
  fontStyle: "italic" as const,
  fontSize: "16px",
  letterSpacing: "1px",
  color: "#ffffff",
  margin: "0 0 4px",
};

const footerMeta: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "10px",
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
  color: "rgba(255,255,255,0.55)",
  margin: 0,
};

const envelopeFootnote: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "11px",
  color: MUTED,
  margin: 0,
  lineHeight: "1.6",
};
