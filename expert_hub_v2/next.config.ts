import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname,".."),
  outputFileTracingIncludes: { "/api/mockup-assets/*": ["../expert_catalog_mockup/assets/graphics/**/*"] },
};
export default nextConfig;
