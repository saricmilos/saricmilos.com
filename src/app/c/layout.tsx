import type { Metadata } from "next";

// A client's private pages: never indexed, never linked to, and no address of theirs is
// ever sent on as a Referer. Analytics stays off here too (CookieConsent skips /c/).
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <main className="w-full flex-1 bg-(--fp-bg)">{children}</main>;
}
