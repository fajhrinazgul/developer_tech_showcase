import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: '10.189.34.131',
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
    ],
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
