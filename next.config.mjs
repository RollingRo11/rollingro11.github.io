/** @type {import('next').NextConfig} */
const nextConfig = {
  // `next dev` keeps its live manifests and chunks in this directory and reads
  // them on every request, so a `next build` running alongside it will pull the
  // rug out and leave the dev server 500ing until it's restarted. Setting
  // NEXT_DIST_DIR sends a build to a scratch directory instead — see the
  // `build:check` script.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
