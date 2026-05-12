import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected machine learning and AI projects by Milos Saric, including production analytics and creator intelligence systems.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 text-slate-100">
      <h1 className="text-4xl font-semibold tracking-tight">Selected Projects</h1>
      <ul className="mt-8 list-disc space-y-4 pl-6 leading-8 text-slate-300">
        <li>Cassiopeia AI: creator intelligence and cross-platform performance analytics.</li>
        <li>Creator Operating System: workflow automation and AI-assisted decision support.</li>
        <li>FastAPI + React stacks for scalable analytics and reporting interfaces.</li>
      </ul>
    </main>
  );
}
