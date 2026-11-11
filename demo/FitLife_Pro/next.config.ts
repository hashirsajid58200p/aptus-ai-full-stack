import type { NextConfig } from "next";

// DEMO_EXPORT=1 builds a static copy served by the main site at /demo/1
const isDemoExport = process.env.DEMO_EXPORT === "1";

const nextConfig: NextConfig = {
  devIndicators: false,
  ...(isDemoExport && {
    output: "export",
    basePath: "/demo/1",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
