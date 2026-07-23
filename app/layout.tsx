import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  // Every page's <title> ends with "| Ziro Market". The template appends the
  // brand to any child page's string title; `default` is used for the homepage
  // and already ends with the brand itself.
  title: {
    default: "The Indian market, simplified. | Ziro Market",
    template: "%s | Ziro Market",
  },
  description: "Track what's moving, understand why it's moving. Live heatmaps, portfolio analytics, sector intelligence and smart watchlists : built for India.",
  keywords: ["Indian Stock Market", "NIFTY 50", "SENSEX", "NSE", "BSE", "MCX", "Sector Heatmap", "Portfolio Tracker", "Ziro Market"],
  authors: [{ name: "Ziro Market Team" }],
  creator: "Ziro Market",
  publisher: "Ziro Market",
  applicationName: "Ziro Market",
  formatDetection: { email: false, address: false, telephone: false },
  robots: { index: true, follow: true },
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
    title: "Ziro Market : The Indian market, simplified.",
    description: "Track what's moving, understand why it's moving. Built for India.",
    url: SITE_URL,
    siteName: "Ziro Market",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Ziro Market : The Indian market, simplified." }],
    type: "website",
    locale: 'en_IN',
  },
  twitter: {
    card: "summary_large_image",
    title: "Ziro Market : The Indian market, simplified.",
    description: "Track what's moving, understand why it's moving. Built for India.",
    images: ["/opengraph-image"],
    creator: "@ziromarket",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Ziro Market" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
