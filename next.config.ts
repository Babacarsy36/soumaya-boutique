import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Un package-lock.json traîne dans le dossier personnel : on fixe la racine du projet.
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
