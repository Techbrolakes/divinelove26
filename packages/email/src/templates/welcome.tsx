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

interface WelcomeEmailProps {
  firstName: string;
}

export function WelcomeEmail({ firstName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to YourApp, {firstName}!</Preview>
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
            <Heading style={heading}>Welcome to YourApp!</Heading>
            <Text style={paragraph}>Hi {firstName},</Text>
            <Text style={paragraph}>
              Your account has been created successfully. You&apos;re now ready
              to get started.
            </Text>

            <Section style={featureBox}>
              <Text style={featureItem}>
                Explore everything YourApp has to offer — all in one place.
              </Text>
            </Section>

            <Text style={paragraph}>
              If you have any questions, our support team is always here to help.
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
  margin: "0 0 24px",
  color: "#1e1e2e",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#535051",
  margin: "0 0 16px",
};

const featureBox: React.CSSProperties = {
  backgroundColor: "#eef2ff",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "8px 0 20px",
  borderLeft: "3px solid #6366f1",
};

const featureItem: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#535051",
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

export default WelcomeEmail;
