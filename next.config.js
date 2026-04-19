/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // Fix for mobile navigation in Next.js 16
  allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000', '172.27.218.29:3000'],
}

module.exports = nextConfig