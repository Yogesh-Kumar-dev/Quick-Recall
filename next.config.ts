import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

// PWA: this project builds with Turbopack, and @serwist/next's webpack-based compilation is
// incompatible with it — @serwist/turbopack works around the lack of a Turbopack plugin API by
// compiling the service worker via a Route Handler instead (src/app/serwist/[path]/route.ts).
// `withSerwist` here only adds the esbuild/esbuild-wasm packages to serverExternalPackages so
// that route handler can bundle in a Node runtime.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thesvg.org",
        pathname: "/icons/**",
      },
    ],
  },
};

export default withSerwist(nextConfig);
