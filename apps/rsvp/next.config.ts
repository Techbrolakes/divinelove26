import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(__dirname, "../..");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  outputFileTracingRoot: monorepoRoot,
  outputFileTracingIncludes: {
    "/api/trpc/[trpc]": ["../../packages/email/assets/**/*"],
  },
};

export default nextConfig;
