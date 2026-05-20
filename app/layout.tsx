import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
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
  alternates: { canonical: "/" },
  title: "Ziro Market — Indian markets, without the noise.",
  description: "Live heatmaps, portfolio analytics, sector intelligence and watchlists — built for India, in one app that loads in under a second.",
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
    title: "Ziro Market — Indian markets, without the noise.",
    description: "Live heatmaps, portfolio analytics, watchlists — built for India.",
    url: "https://ziromarket.com",
    siteName: "Ziro Market",
    images: [{ url: "/app_icon/ziro.png", width: 1024, height: 1024, alt: "Ziro Market" }],
    type: "website",
    locale: 'en_IN',
  },
  twitter: {
    card: "summary_large_image",
    title: "Ziro Market — Indian markets, without the noise.",
    description: "Built for India. No autoplay ads, no buried buttons, no USD defaults.",
    images: ["/app_icon/ziro.png"],
    creator: "@ziromarket",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Ziro Market" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
