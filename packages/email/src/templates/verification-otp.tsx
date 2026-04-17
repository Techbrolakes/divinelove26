import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationOTPEmailProps {
  otp: string;
  expiryMinutes?: number;
}

export function VerificationOTPEmail({
  otp,
  expiryMinutes = 15,
}: VerificationOTPEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your YourApp verification code: {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Brand accent bar */}
          <Section style={accentBar} />

          {/* Header */}
          <Section style={headerSection}>
            <Text style={brandName}>YourApp</Text>
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <Heading style={heading}>Verify your email</Heading>
            <Text style={paragraph}>
              Enter the following code to verify your email address and create
              your YourApp account:
            </Text>
            <Section style={codeContainer}>
              <Text style={codeLabel}>Your verification code</Text>
              <Text style={code}>{otp}</Text>
            </Section>
            <Text style={paragraphMuted}>
              This code expires in {expiryMinutes} minutes. If you didn&apos;t
              request this, you can safely ignore this email.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} YourApp. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main: React.CSSProperties = {
  backgroundColor: "#f0f0f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "40px 20px",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "520px",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};

const accentBar: React.CSSProperties = {
  height: "4px",
  background: "linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)",
  backgroundColor: "#6366f1",
};

const headerSection: React.CSSProperties = {
  padding: "32px 40px 0",
  textAlign: "center" as const,
};

const brandName: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "bold",
  color: "#6366f1",
  margin: "0",
  letterSpacing: "-0.5px",
};

const contentSection: React.CSSProperties = {
  padding: "24px 40px 32px",
};

const heading: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 12px",
  color: "#1e1e2e",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#535051",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const paragraphMuted: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#8898aa",
  margin: "0",
  textAlign: "center" as const,
};

const codeContainer: React.CSSProperties = {
  background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
  backgroundColor: "#eef2ff",
  borderRadius: "12px",
  padding: "28px 16px",
  margin: "0 0 20px",
  textAlign: "center" as const,
  border: "1px solid #c7d2fe",
};

const codeLabel: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#6b7280",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const code: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: "bold",
  letterSpacing: "10px",
  color: "#4f46e5",
  margin: "0",
};

const footerSection: React.CSSProperties = {
  padding: "0 40px 32px",
  textAlign: "center" as const,
  borderTop: "1px solid #e5e7eb",
  marginLeft: "40px",
  marginRight: "40px",
  paddingTop: "24px",
  paddingLeft: "0",
  paddingRight: "0",
};

const footerText: React.CSSProperties = {
  fontSize: "13px",
  color: "#8898aa",
  margin: "0 0 4px",
};

export default VerificationOTPEmail;
