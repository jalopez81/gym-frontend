import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    // Optimiza las librerías que suelen ralentizar el dev
    optimizePackageImports: [
      'lucide-react', 
      '@headlessui/react', 
      '@heroicons/react',
      'lodash'
    ],
  },
};

export default nextConfig;