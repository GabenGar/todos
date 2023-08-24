const mdx = require("@next/mdx");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    mdxRs: true,
  },
};

const withMDX = mdx();

module.exports = withMDX(nextConfig);
