/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
