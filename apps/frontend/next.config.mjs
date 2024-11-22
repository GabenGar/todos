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
    experimental: {
      typedRoutes: true,
    },
  };

  return nextConfig;
}

export default createNextConfig;
