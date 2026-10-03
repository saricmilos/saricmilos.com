import type { MetadataRoute } from "next";

const siteUrl = "https://www.saricmilos.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The client centre is private: clients' pages and the admin.
      disallow: ["/c/", "/clients", "/api/clients/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
