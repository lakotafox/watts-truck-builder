import type { NextConfig } from "next";

// When EXPORT=1, build a static site mounted under /watts (for embedding into
// the lakotafox.com Portfolio repo, which Netlify auto-deploys). Otherwise it's
// a normal Next app (standalone deploy of the watts-truck-builder repo).
const isExport = process.env.EXPORT === "1";

const nextConfig: NextConfig = isExport
  ? {
      output: "export",
      basePath: "/watts",
      assetPrefix: "/watts",
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
