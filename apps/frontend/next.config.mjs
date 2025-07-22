// @ts-check
import nextEnv from "@next/env";

const projectDir = process.cwd();
nextEnv.loadEnvConfig(projectDir);

/**
 * @returns {Promise<import('next').NextConfig>}
 */
async function createNextConfig() {
  const baseURL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
  const basePathname = !baseURL
    ? undefined
    : new URL(baseURL, "https://example.com").pathname;
  const basePath =
    !basePathname || basePathname === "/" ? undefined : basePathname;

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    assetPrefix: basePath,
    basePath,
    output: "export",
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: "dist",
    sassOptions: {
      // a duct tape
      // https://github.com/vercel/next.js/discussions/67931#discussioncomment-11044560
      // until nextjs releases a next major
      // https://github.com/vercel/next.js/issues/71638#issuecomment-2454463904
      silenceDeprecations: ["legacy-js-api"],
    },
    transpilePackages: ["@repo/ui"],
    experimental: {
      typedRoutes: true
    },
  };

  return nextConfig;
}

export default createNextConfig;
