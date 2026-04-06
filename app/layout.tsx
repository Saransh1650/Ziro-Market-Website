import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";
import ScrollRevealObserver from "@/components/ScrollRevealObserver";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ziro Market — India's High-Density Market Intelligence App",
  description: "Track NIFTY 50, SENSEX, sector heatmaps, top movers, volume surges and institutional signals in one powerful mobile app. Join the waitlist.",
  openGraph: {
    title: "Ziro Market — India's Market Intelligence App",
    description: "Real-time NIFTY & SENSEX signals for the serious Indian investor.",
    type: "website",
    locale: 'en_IN',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body style={{ visibility: 'visible', opacity: 1, position: 'relative' }}>
        <ScrollRevealObserver />
        <ScrollProgress />
        <CursorGlow />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
