import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-var",
  display: "swap",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vivid Geeks Digital — Search, Growth, Creative, Infrastructure, Retention",
  description:
    "Vivid Geeks Digital builds systems that turn clicks into revenue — SEO, AEO, paid media, creative, web, CRM, and retention under one roof.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
