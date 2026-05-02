import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  firstName: string;
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

export function WelcomeEmail({ firstName, monogramCid }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light only" />
      </Head>
      <Preview>Welcome to Divine Love 26, {firstName}</Preview>
      <Body style={body}>
        <Container style={wrapper}>
          <Section style={hero}>
            {monogramCid ? (
              <Img
                src={`cid:${monogramCid}`}
                alt="Divine Love 26"
                width="72"
                height="72"
                style={monogramImg}
              />
            ) : null}
            <Text style={brand}>Divine Love 26</Text>
          </Section>

          <Section style={card}>
            <Heading style={heading}>Welcome, {firstName}</Heading>
            <Text style={paragraph}>
              Your account is ready. You can now manage guests, send
              invitations, and check guests in on the day.
            </Text>

            <Section style={featureBox}>
              <Text style={featureItem}>
                Tip: head to the dashboard to send your first batch of
                invitations.
              </Text>
            </Section>

            <Text style={paragraphMuted}>
              If you didn&apos;t expect this email, you can safely ignore it.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footnote}>
              &copy; {new Date().getFullYear()} Divine Love 26
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;

const body: React.CSSProperties = {
  backgroundColor: PAPER,
  fontFamily: SANS,
  margin: 0,
  padding: "32px 0",
};

const wrapper: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "560px",
  width: "100%",
  padding: "0 16px",
};

const hero: React.CSSProperties = {
  background: `linear-gradient(160deg, ${ROYAL_DEEP} 0%, ${ROYAL_DARK} 100%)`,
  backgroundColor: ROYAL_DARK,
  textAlign: "center",
  padding: "30px 24px 26px",
  borderRadius: "6px 6px 0 0",
  borderTop: `4px solid ${GOLD}`,
};

const monogramImg: React.CSSProperties = {
  display: "block",
  margin: "0 auto 12px",
  borderRadius: "50%",
  border: `1px solid ${GOLD}`,
};

const brand: React.CSSProperties = {
  fontSize: "20px",
  fontFamily: SERIF,
  fontStyle: "italic",
  color: GOLD_LIGHT,
  margin: 0,
  fontWeight: 500,
  letterSpacing: "1px",
};

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: `1px solid ${BORDER}`,
  borderTop: 0,
  borderRadius: "0 0 6px 6px",
  padding: "28px 32px 24px",
};

const heading: React.CSSProperties = {
  fontSize: "22px",
  fontFamily: SERIF,
  fontStyle: "italic",
  textAlign: "center" as const,
  margin: "0 0 16px",
  color: ROYAL_DARK,
  fontWeight: 600,
};

const paragraph: React.CSSProperties = {
  fontSize: "14.5px",
  lineHeight: 1.65,
  color: INK,
  margin: "0 0 16px",
};

const paragraphMuted: React.CSSProperties = {
  fontSize: "12.5px",
  lineHeight: 1.6,
  color: MUTED,
  margin: 0,
};

const featureBox: React.CSSProperties = {
  backgroundColor: "#faf6ef",
  border: `1px solid ${BORDER}`,
  borderRadius: "6px",
  padding: "16px 20px",
  margin: "0 0 18px",
  borderLeft: `3px solid ${ROYAL}`,
};

const featureItem: React.CSSProperties = {
  fontSize: "13.5px",
  lineHeight: 1.55,
  color: INK,
  margin: 0,
};

const footer: React.CSSProperties = {
  padding: "16px 8px",
  textAlign: "center" as const,
};

const footnote: React.CSSProperties = {
  fontSize: "11px",
  color: MUTED,
  margin: 0,
};
