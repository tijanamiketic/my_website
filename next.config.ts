import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // ~13 KB of CSS for a mostly single-page site: inlining removes the render-blocking request.
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    // Add hosts here if you use remote images in /content (e.g. project screenshots on a CDN).
    remotePatterns: [],
  },
  turbopack: {
    // Pin the project root (a stray package-lock.json higher up would otherwise be picked up).
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
