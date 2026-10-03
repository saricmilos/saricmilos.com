import type { Metadata } from "next";

// The admin side of the client centre: Milos only, never indexed, nothing sent to analytics.
export const metadata: Metadata = {
  title: { absolute: "Client centre · Miloš Sarić" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return <main className="w-full flex-1 bg-(--fp-bg)">{children}</main>;
}
