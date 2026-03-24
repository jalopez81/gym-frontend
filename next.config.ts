import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    // Optimiza las librerías que suelen ralentizar el dev
    optimizePackageImports: [
      'lucide-react', 
      '@headlessui/react', 
      '@heroicons/react',
      '@mui/material',
      '@mui/icons-material',
      'lodash',
      '@mui/x-data-grid', 
      'recharts',
    ],
    serverComponentsHmrCache: true,
  },
};

export default withNextIntl(nextConfig);