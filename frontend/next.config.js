/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 800,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/start",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3100";
    return [
      // Static demo sites built by scripts/build-demos.sh into public/demo/{1,2,3}
      {
        source: "/demo/:n(1|2|3)",
        destination: "/demo/:n/index.html",
      },
      {
        source: "/demo/:n(1|2|3)/",
        destination: "/demo/:n/index.html",
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/health",
        destination: `${backendUrl}/health`,
      },
    ];
  },
};

module.exports = nextConfig;
