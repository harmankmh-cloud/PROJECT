import type { NextConfig } from "next";
import path from "path";

// Monorepo: Vercel sets outputFileTracingRoot to the git root; turbopack.root must match.
const monorepoRoot = path.resolve(__dirname, "..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
