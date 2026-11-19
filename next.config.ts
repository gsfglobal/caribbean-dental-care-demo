import type { NextConfig } from "next";

// GitHub Pages / sottocartella: PAGES_BASE="/caribbean-dental-care-demo" → modalità demo (noindex)
const base = process.env.PAGES_BASE ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: base || undefined,
  env: { NEXT_PUBLIC_BASE: base },
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
