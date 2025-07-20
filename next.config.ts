import nextIntl from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = nextIntl(); 

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
