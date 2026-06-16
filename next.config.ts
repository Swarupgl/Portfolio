import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        images: { unoptimized: true },
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
