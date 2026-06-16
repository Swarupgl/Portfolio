import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteBackground from "@/components/SiteBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swarup G L | Portfolio",
  description:
    "Swarup G L — AI Researcher, IoT Engineer, and Full-Stack Developer. Projects, skills, and community work.",

  /* ── Open Graph (link preview on WhatsApp, Telegram, etc.) ─ */
  openGraph: {
    title: "Swarup G L | AI & Systems Portfolio",
    description:
      "AI Researcher building systems at the intersection of Deep Learning, Computer Vision, and Embedded Hardware.",
    url: "https://swarupgl.vercel.app",
    siteName: "Swarup G L Portfolio",
    images: [
      {
        url: "/images/swarup_g_l.jpg",
        width: 1200,
        height: 630,
        alt: "Swarup G L",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  /* ── Twitter / X card ─────────────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    title: "Swarup G L | Portfolio",
    description: "AI Researcher & Systems Engineer — IIIT Raichur.",
    images: ["/images/swarup_g_l.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative min-h-screen overflow-x-hidden antialiased`}
      >
        <SiteBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
