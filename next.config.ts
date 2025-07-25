// next.config.ts
import nextIntl from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = nextIntl()

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'image.tmdb.org'
    }]
  },

  async rewrites() {
    return [
      // 1) Serve your custom HTML at /api/docs-ui
      {
        source: '/api/docs-ui',
        destination: '/swagger-ui.html'
      },

      // 2) Serve your JSON OpenAPI spec at /api/docs/swagger.json
      //    (this forwards to the Next.js route in app/api/swagger/route.ts)
      {
        source: '/api/docs/swagger.json',
        destination: '/api/swagger'
      },

    ]
  }
}

export default withNextIntl(nextConfig)
