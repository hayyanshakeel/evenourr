// File: next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This 'images' block is what we are adding
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;