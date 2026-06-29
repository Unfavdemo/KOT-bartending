import type { Metadata } from "next";
import { Oswald, DM_Sans } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const display = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Elite Mobile Bartending`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description:
    "Elite certified minority/woman-owned mobile bartending for private parties, corporate events, and cocktail classes. Hand-crafted simple syrups shop.",
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
    url: "https://www.kittyontopbartending.com",
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
