import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [new URL('http://10.189.34.131/media/**')],
  },
  experimental: {
    proxyClientMaxBodySize: '10mb',
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  allowedDevOrigins: ['localhost', '10.189.34.131', '127.0.0.1'],
}

export default nextConfig
