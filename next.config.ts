import type { NextConfig } from "next";

// The client centre's pages (/clients for Milos, /c/<link> for a client) are private:
// no search engine, no cache along the way, no Referer carrying a client's link elsewhere,
// and no framing by any other site.
const privateHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Cache-Control", value: "private, no-store, max-age=0" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
];

const nextConfig: NextConfig = {
  async headers() {
    return ["/c/:path*", "/clients", "/clients/:path*", "/api/clients/:path*"].map((source) => ({
      source,
      headers: privateHeaders,
    }));
  },
  // The signed PDF's font is read from disk, so it has to travel with those routes.
  outputFileTracingIncludes: {
    "/c/**": ["./src/lib/clients/fonts/*.ttf"],
    "/api/clients/**": ["./src/lib/clients/fonts/*.ttf"],
  },
  // PGlite is the local stand-in for Neon in `npm run dev`; it is loaded, not bundled.
  serverExternalPackages: ["@electric-sql/pglite"],
  experimental: {
    // A drawn signature travels with the sign form; it stays well under this.
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
