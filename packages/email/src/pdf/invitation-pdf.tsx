import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import QRCode from "qrcode";
import * as React from "react";

export interface InvitationPDFEvent {
  name: string;
  date: Date | string;
  endTime?: Date | string | null;
  venueName: string;
  venueAddress?: string | null;
  dressCode?: string | null;
  description?: string | null;
}

export interface RenderInvitationPDFInput {
  fullName: string;
  code: string;
  events?: InvitationPDFEvent[];
  coupleNames?: string;
  weddingDateLabel?: string;
}

const ROYAL = "#0b3d91";
const ROYAL_DARK = "#082a66";
const ROYAL_LIGHT = "#1a56c4";
const INK = "#1c1d22";
const MUTED = "#6b7280";
const CREAM = "#faf6ef";
const BORDER = "#e5e7eb";

const DEFAULT_COUPLE = "Ikhioya David & Idah Joy";
const DEFAULT_DATE = "Saturday, 20 June 2026";
const ADDRESS_FALLBACK = "Address to be announced";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 0,
    fontFamily: "Helvetica",
    color: INK,
  },
  accentBar: { height: 8, backgroundColor: ROYAL },
  frame: { padding: "36 48 36 48" },
  header: { alignItems: "center", marginBottom: 20 },
  postmark: {
    fontSize: 8,
    letterSpacing: 4,
    color: MUTED,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  monogram: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ROYAL,
    color: "#ffffff",
    fontSize: 20,
    textAlign: "center",
    paddingTop: 16,
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },
  overline: {
    fontSize: 8,
    letterSpacing: 4,
    color: MUTED,
    textTransform: "uppercase",
    marginTop: 4,
    marginBottom: 6,
  },
  couple: {
    fontSize: 26,
    color: ROYAL_DARK,
    fontFamily: "Times-Italic",
    textAlign: "center",
    marginBottom: 4,
  },
  dateHeadline: {
    fontSize: 10,
    letterSpacing: 3,
    color: ROYAL_DARK,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginTop: 6,
  },
  greetingBlock: { marginTop: 4, marginBottom: 18 },
  greeting: {
    fontSize: 14,
    fontFamily: "Times-Italic",
    color: ROYAL_DARK,
    marginBottom: 6,
  },
  paragraph: { fontSize: 10.5, color: "#4a4f57", lineHeight: 1.6 },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 3,
    color: MUTED,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    textAlign: "center",
  },
  ticket: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: ROYAL,
    borderRadius: 6,
    padding: 20,
    alignItems: "center",
    backgroundColor: CREAM,
    marginBottom: 16,
  },
  ticketCaption: {
    fontSize: 10,
    fontFamily: "Times-Italic",
    color: ROYAL,
    marginBottom: 8,
  },
  ticketCodeLabel: {
    fontSize: 7,
    letterSpacing: 3,
    color: MUTED,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  ticketCode: {
    fontSize: 28,
    letterSpacing: 6,
    color: ROYAL_DARK,
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
  },
  qr: {
    width: 150,
    height: 150,
    marginTop: 6,
    marginBottom: 10,
  },
  ticketHint: {
    fontSize: 8.5,
    fontFamily: "Times-Italic",
    color: MUTED,
    textAlign: "center",
    maxWidth: 320,
  },
  eventCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 3,
    borderLeftColor: ROYAL,
    borderRadius: 4,
    padding: 12,
    marginTop: 10,
    backgroundColor: CREAM,
  },
  eventRow: { flexDirection: "row" },
  eventTimePill: {
    backgroundColor: ROYAL,
    color: "#ffffff",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 999,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    marginRight: 10,
    alignSelf: "flex-start",
  },
  eventBody: { flex: 1 },
  eventName: {
    fontSize: 13,
    color: ROYAL_DARK,
    fontFamily: "Times-Roman",
    marginBottom: 2,
  },
  eventVenue: { fontSize: 9.5, color: INK, marginBottom: 2 },
  eventAddress: { fontSize: 8.5, color: MUTED, marginBottom: 4 },
  eventMeta: { fontSize: 8, color: MUTED },
  eventMetaLabel: {
    fontSize: 7,
    letterSpacing: 2,
    color: ROYAL,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  closing: { marginTop: 22, alignItems: "center" },
  closingLine: {
    fontSize: 9.5,
    color: MUTED,
    fontFamily: "Times-Italic",
    marginBottom: 4,
  },
  signature: {
    fontSize: 20,
    color: ROYAL,
    fontFamily: "Times-Italic",
  },
  footerBand: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ROYAL_DARK,
    padding: 14,
    alignItems: "center",
  },
  footerHashtag: {
    fontSize: 11,
    fontFamily: "Times-Italic",
    color: "#ffffff",
    marginBottom: 2,
    letterSpacing: 1,
  },
  footerMeta: {
    fontSize: 7,
    letterSpacing: 2,
    color: "#cbd5f5",
    textTransform: "uppercase",
  },
});

function formatTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCode(code: string): string {
  return code.replace(/(\d{3})(\d{3})/, "$1 $2");
}

function InvitationDocument({
  fullName,
  code,
  events,
  qrDataUrl,
  coupleNames,
  weddingDateLabel,
}: RenderInvitationPDFInput & { qrDataUrl: string }) {
  const firstName = fullName.trim().split(/\s+/)[0] ?? fullName;
  const couple = coupleNames ?? DEFAULT_COUPLE;
  const dateLabel = weddingDateLabel ?? DEFAULT_DATE;

  return (
    <Document
      title={`${couple} — Wedding Invitation`}
      author={couple}
      subject="Wedding Invitation"
      creator="Divine Love 26"
      producer="Divine Love 26"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />

        <View style={styles.frame}>
          <View style={styles.header}>
            <Text style={styles.postmark}>
              · You are cordially invited ·
            </Text>
            <Text style={styles.monogram}>DL</Text>
            <Text style={styles.overline}>The wedding of</Text>
            <Text style={styles.couple}>{couple}</Text>
            <Text style={styles.dateHeadline}>{dateLabel}</Text>
          </View>

          <View style={styles.greetingBlock}>
            <Text style={styles.greeting}>Dear {firstName},</Text>
            <Text style={styles.paragraph}>
              It is with joyful hearts that we invite you to share in the
              celebration of our marriage. Please present this invitation
              at the door — the QR code and your six-digit code will admit
              you.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Your personal code</Text>
          <View style={styles.ticket}>
            <Text style={styles.ticketCaption}>Present at the door</Text>
            <Text style={styles.ticketCodeLabel}>Invitation code</Text>
            <Text style={styles.ticketCode}>{formatCode(code)}</Text>
            <Image src={qrDataUrl} style={styles.qr} />
            <Text style={styles.ticketHint}>
              Scan the QR on your phone at the door, or share the six-digit
              code. This code is tied to your name — please keep it private.
            </Text>
          </View>

          {events && events.length > 0 ? (
            <View>
              <Text style={styles.sectionLabel}>The day at a glance</Text>
              {events.map((event, i) => (
                <View key={i} style={styles.eventCard}>
                  <View style={styles.eventRow}>
                    <Text style={styles.eventTimePill}>
                      {formatTime(event.date)}
                    </Text>
                    <View style={styles.eventBody}>
                      <Text style={styles.eventName}>{event.name}</Text>
                      <Text style={styles.eventVenue}>{event.venueName}</Text>
                      <Text style={styles.eventAddress}>
                        {event.venueAddress ?? ADDRESS_FALLBACK}
                      </Text>
                      {event.dressCode ? (
                        <Text style={styles.eventMeta}>
                          <Text style={styles.eventMetaLabel}>Attire </Text>
                          {event.dressCode}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.closing}>
            <Text style={styles.closingLine}>With love and anticipation,</Text>
            <Text style={styles.signature}>{couple}</Text>
          </View>
        </View>

        <View style={styles.footerBand} fixed>
          <Text style={styles.footerHashtag}>#DIVINELOVE26</Text>
          <Text style={styles.footerMeta}>
            20 · June · 2026 · A celebration of love
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderInvitationPDF(
  input: RenderInvitationPDFInput,
): Promise<Buffer> {
  const qrDataUrl = await QRCode.toDataURL(input.code, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 400,
    color: { dark: ROYAL, light: "#ffffff" },
  });

  return renderToBuffer(
    <InvitationDocument {...input} qrDataUrl={qrDataUrl} />,
  );
}
