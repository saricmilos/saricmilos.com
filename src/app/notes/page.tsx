import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Notes on ML engineering, AI product development, and data science implementation by Milos Saric.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 text-slate-100">
      <h1 className="text-4xl font-semibold tracking-tight">Notes</h1>
      <p className="mt-6 leading-8 text-slate-300">
        This section is reserved for practical notes on machine learning engineering, experimentation lessons,
        and production AI implementation patterns.
      </p>
    </main>
  );
}
