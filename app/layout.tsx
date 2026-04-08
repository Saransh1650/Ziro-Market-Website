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
  metadataBase: new URL("https://ziromarket.com"),
  alternates: {
    canonical: "/",
  },
  title: "Ziro Market — India's High-Density Market Intelligence App",
  description: "Track NIFTY 50, SENSEX, sector heatmaps, top movers, volume surges and signals in one powerful mobile app. Join the waitlist for the refined trading terminal.",
  keywords: ["Indian Stock Market", "NIFTY 50", "SENSEX", "NSE", "BSE", "Sector Heatmap", "Trading Signals", "Market Intelligence", "Ziro Market", "Institutional Signals", "Option Chain", "Volume Surges"],
  authors: [{ name: "Ziro Market Team" }],
  creator: "Ziro Market",
  publisher: "Ziro Market",
  applicationName: "Ziro Market",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  openGraph: {
    title: "Ziro Market — India's High-Density Market App",
    description: "Real-time NIFTY & SENSEX signals for the serious Indian investor. Unified market at your fingertips.",
    url: "https://ziromarket.com",
    siteName: "Ziro Market",
    images: [
      {
        url: "/app_icon/ziro.png",
        width: 1024,
        height: 1024,
        alt: "Ziro Market Terminal",
      },
    ],
    type: "website",
    locale: 'en_IN',
  },
  twitter: {
    card: "summary_large_image",
    title: "Ziro Market — India's Stock Market App",
    description: "Track NIFTY, SENSEX, and sector heatmaps in one powerful app. Decisions backed by data.",
    images: ["/app_icon/ziro.png"],
    creator: "@ziromarket",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ziro Market",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b0c0e",
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
