import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FolderOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Course Materials",
  description:
    "Free study materials from the university courses Milos Saric took at the Faculty of Technical Sciences, University of Novi Sad, shared on Google Drive.",
  alternates: { canonical: "/materials" },
};

type Course = {
  name: string;
  // The course's own name, as the faculty and the Drive folder give it
  original: string;
  language: string;
  contents: string[];
  driveUrl: string;
};

type University = {
  name: string;
  studies: string;
  courses: Course[];
};

// One entry per course; a new university gets its own block.
const universities: University[] = [
  {
    name: "Faculty of Technical Sciences, University of Novi Sad",
    studies: "FTN Novi Sad · Bachelor's studies",
    courses: [
      {
        name: "Physics",
        original: "Fizika (E1)",
        language: "Serbian",
        contents: ["Lectures", "Solved problems", "Midterms", "Exam questions", "All-in-one PDF", "Older materials"],
        driveUrl: "https://drive.google.com/drive/folders/1IAo8DHs9XqB1Rqc1z8oTU5QRjj5_iCIa",
      },
    ],
  },
];

export default function MaterialsPage() {
  return (
    <main className="w-full flex-1 bg-(--fp-bg)">
      <div className="mx-auto w-full max-w-4xl px-6 pt-20 pb-16 md:pt-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 transition-colors hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-100"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
          Back to home
        </Link>

        <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
          Course materials
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
          Study materials from the university courses I took, free to open on Google Drive. Each folder is in the
          language the course was taught in.
        </p>

        {universities.map((university) => (
          <section key={university.name} className="mt-12" aria-labelledby={`uni-${university.studies}`}>
            <h2
              id={`uni-${university.studies}`}
              className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400"
            >
              {university.studies}
            </h2>
            <p className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-200">{university.name}</p>

            <div className="mt-5 grid gap-4">
              {university.courses.map((course) => (
                <article
                  key={course.driveUrl}
                  className="rounded-2xl border border-indigo-200/80 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-indigo-400/20 dark:bg-slate-900/60 dark:shadow-black/30"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-200">
                        <FolderOpen className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{course.name}</h3>
                        <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                          {course.original} · in {course.language}
                        </p>
                      </div>
                    </div>
                    <a
                      href={course.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/30 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 transition-colors hover:border-cyan-700/50 hover:bg-cyan-100 dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-200 dark:hover:bg-cyan-400/20"
                    >
                      Open in Google Drive
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                    </a>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`What the ${course.name} folder holds`}>
                    {course.contents.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-400/10 dark:text-indigo-200"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
