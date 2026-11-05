/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/r2-media/:path*',
        destination: 'https://pub-b5908ce97ecc42c18b39affa40116c39.r2.dev/:path*',
      },
    ];
  },
};

export default nextConfig;
