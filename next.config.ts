import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://lh3.googleusercontent.com/**"), new URL("https://utfs.io/**"), new URL('https://**.ufs.sh/**')]
  }
};

export default nextConfig;
