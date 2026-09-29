import type { Metadata } from "next";
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

      <BackToTop />
    </>
  );
}
