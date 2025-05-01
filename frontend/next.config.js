/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `ws` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        dns: false,
        tls: false,
        fs: false,
        bufferutil: false,
        'utf-8-validate': false,
      };
    }
    return config;
  },
  images: {
    domains: ['localhost']
  }
};

module.exports = nextConfig;
