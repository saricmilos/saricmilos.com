import type { Metadata } from "next";
import Link from "next/link";
import BackToTop from "@/components/BackToTop";
import Frontpage from "@/components/Frontpage";

const siteUrl = "https://www.saricmilos.com";

export const metadata: Metadata = {
  title: "Milos Saric | Machine Learning Engineer Portfolio",
  description:
    "Portfolio of Milos Saric, ML/AI Engineer and Data Scientist. Explore applied AI projects, production machine learning systems, publications, and contact information.",
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Milos Saric",
      url: siteUrl,
      jobTitle: "ML / AI Engineer",
      description:
        "ML/AI Engineer and Data Scientist focused on applied AI, NLP, and analytics systems.",
      sameAs: [
        "https://github.com/saricmilos",
        "https://youtube.com/@saricmilos",
        "https://instagram.com/sariccmilos",
        "https://tiktok.com/@sariccmilos",
        "https://www.linkedin.com/in/milossaric",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "saricmilos.com",
      publisher: { "@id": `${siteUrl}/#person` },
      inLanguage: "en-US",
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: "Milos Saric - ML / AI Engineer",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#person` },
      primaryImageOfPage: `${siteUrl}/Me.jpg`,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Frontpage />

      <section className="w-full bg-slate-950 px-6 py-16 text-slate-100 md:px-10 lg:px-16" aria-label="About Milos Saric">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <article>
            <h2 className="text-3xl font-semibold tracking-tight">About</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Milos Saric is an ML/AI Engineer and Data Scientist focused on building production-ready machine learning systems.
              His work spans NLP, recommendation, data pipelines, and analytics products that connect model outputs to measurable business outcomes.
            </p>
          </article>
          <article>
            <h2 className="text-3xl font-semibold tracking-tight">Services</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-300">
              <li>Applied machine learning system design and deployment</li>
              <li>NLP and LLM product workflows for creator and business intelligence</li>
              <li>Analytics dashboards and data science experimentation pipelines</li>
              <li>Model evaluation, monitoring, and iteration for production quality</li>
            </ul>
          </article>
          <article>
            <h2 className="text-3xl font-semibold tracking-tight">Selected Projects</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-300">
              <li>Cassiopeia AI: cross-platform content intelligence and growth analytics</li>
              <li>Creator Operating System: AI workflows combining YouTube and Instagram signals</li>
              <li>FastAPI + React implementations for scalable analytics and automation</li>
            </ul>
          </article>
          <article>
            <h2 className="text-3xl font-semibold tracking-tight">Publications</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Master&apos;s thesis and research-driven work focused on practical AI engineering and machine learning applications.
              Publication links are available in the profile section above.
            </p>
          </article>
        </div>
      </section>

      <section className="w-full bg-slate-900 px-6 py-14 text-slate-100 md:px-10 lg:px-16" aria-label="Contact Milos Saric">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight">Contact</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            For collaborations, consulting, or full-time ML/AI engineering opportunities, contact Milos Saric at
            <a className="ml-1 underline decoration-cyan-400 underline-offset-4" href="mailto:milossaric@outlook.com">
              milossaric@outlook.com
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link className="underline decoration-cyan-400 underline-offset-4" href="/about">
              About
            </Link>
            <Link className="underline decoration-cyan-400 underline-offset-4" href="/projects">
              Projects
            </Link>
            <Link className="underline decoration-cyan-400 underline-offset-4" href="/notes">
              Notes
            </Link>
          </div>
        </div>
      </section>

      <BackToTop />
    </>
  );
}
