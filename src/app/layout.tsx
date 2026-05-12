import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.saricmilos.com";
const defaultTitle = "Milos Saric | ML / AI Engineer";
const defaultDescription =
  "Milos Saric is an ML/AI Engineer and Data Scientist building production AI systems, analytics platforms, and applied machine learning products.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  title: {
    default: defaultTitle,
    template: "%s | Milos Saric",
  },
  description: defaultDescription,
  applicationName: "saricmilos.com",
  authors: [{ name: "Milos Saric", url: siteUrl }],
  creator: "Milos Saric",
  publisher: "Milos Saric",
  keywords: [
    "Milos Saric",
    "ML Engineer",
    "AI Engineer",
    "Data Scientist",
    "Machine Learning Portfolio",
    "Applied AI",
    "NLP Engineer",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: siteUrl,
    siteName: "saricmilos.com",
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    creator: "@sariccmilos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
