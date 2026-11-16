import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Old demo blog URLs → the real posts that replaced them (Serbian at "/blog", English at "/en/blog").
  async redirects() {
    const moved = [
      ["teaching-prompting-to-non-engineers", "how-to-use-llms-and-write-prompts"],
      ["designing-ai-features-people-trust", "differences-between-llms"],
    ];
    return moved.flatMap(([from, to]) =>
      ["", "/sr", "/en"].map((prefix) => ({
        source: `${prefix}/blog/${from}`,
        destination: `${prefix === "/en" ? "/en" : ""}/blog/${to}`,
        statusCode: 301 as const,
      })),
    );
  },
  // Resource files (public/resources/*.md) always download instead of opening in the browser.
  async headers() {
    return [
      {
        source: "/resources/:file([^/]+\\.md)",
        headers: [
          { key: "Content-Type", value: "text/markdown; charset=utf-8" },
          { key: "Content-Disposition", value: "attachment" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
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
