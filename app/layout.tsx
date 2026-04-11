import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/uncut-sans/400.css";
import "@fontsource/uncut-sans/500.css";
import "@fontsource/uncut-sans/600.css";
import "@fontsource/uncut-sans/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://indocorits.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "INDOCOR ITS Student Chapter",
    template: "%s | INDOCOR ITS",
  },
  description:
    "Official Website of Indonesian Corrosion Association — Student Chapter of Institut Teknologi Sepuluh Nopember",
  keywords: [
    "INDOCOR",
    "ITS",
    "Student Chapter",
    "Corrosion",
    "Institut Teknologi Sepuluh Nopember",
    "Teknik Material",
    "Korosi",
  ],
  authors: [{ name: "INDOCOR ITS Student Chapter" }],
  creator: "INDOCOR ITS Student Chapter",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    title: "INDOCOR ITS Student Chapter",
    description:
      "Official Website of Indonesian Corrosion Association — Student Chapter of Institut Teknologi Sepuluh Nopember",
    siteName: "INDOCOR ITS",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 600,
        alt: "INDOCOR ITS Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "INDOCOR ITS Student Chapter",
    description:
      "Official Website of Indonesian Corrosion Association — Student Chapter of Institut Teknologi Sepuluh Nopember",
    images: ["/logo.svg"],
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
