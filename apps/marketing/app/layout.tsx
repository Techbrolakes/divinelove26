import "./globals.css";
import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  Monsieur_La_Doulaise,
} from "next/font/google";
import { Providers } from "@/providers/trpc-provider";
import SceneBackdrop from "@/components/ui/scene-backdrop";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const monsieur = Monsieur_La_Doulaise({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Divine Love 26 | Wedding Celebration",
  description:
    "Join us as we celebrate our love. RSVP, view event details, and explore our story.",
  openGraph: {
    title: "Divine Love 26 | Wedding Celebration",
    description:
      "Join us as we celebrate our love. RSVP, view event details, and explore our story.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${monsieur.variable} h-full antialiased`}
    >
      <body className="relative h-screen overflow-hidden">
        <SceneBackdrop />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
