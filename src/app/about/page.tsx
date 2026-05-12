import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Milos Saric: ML/AI Engineer and Data Scientist building production machine learning systems.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 text-slate-100">
      <h1 className="text-4xl font-semibold tracking-tight">About Milos Saric</h1>
      <p className="mt-6 leading-8 text-slate-300">
        Milos Saric is an ML/AI Engineer and Data Scientist focused on applied AI, NLP, and production analytics.
        He builds practical systems that connect data pipelines, model outputs, and measurable business outcomes.
      </p>
      <p className="mt-4 leading-8 text-slate-300">
        Core areas include machine learning architecture, experimentation workflows, dashboarding, and operational model quality.
      </p>
    </main>
  );
}
