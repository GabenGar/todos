// @ts-check
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import { PHASE_PRODUCTION_BUILD } from "next/constants.js";
import { PWAWebpackPlugin } from "@repo/webpack";

const projectDir = process.cwd();
nextEnv.loadEnvConfig(projectDir);

/**
 * @param {string} phase
 * @returns {Promise<import('next').NextConfig>}
 */
async function createNextConfig(phase) {
  if (phase === PHASE_PRODUCTION_BUILD) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const devOutputPath = path.join(__dirname, "public");
    const devWorkerPath = path.resolve(devOutputPath, "service-worker.js");
    const devWorkerMapPath = path.resolve(
      devOutputPath,
      "service-worker.js.map",
    );

    // remove dev worker output from `public`
    // so it won't be gobbled up as a build input
    await fs.rm(devWorkerPath, { force: true });
    await fs.rm(devWorkerMapPath, { force: true });
  }

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
    sassOptions: {
      // a duct tape
      // https://github.com/vercel/next.js/discussions/67931#discussioncomment-11044560
      // until nextjs releases a next major
      // https://github.com/vercel/next.js/issues/71638#issuecomment-2454463904
      silenceDeprecations: ["legacy-js-api"],
    },
    transpilePackages: ["@repo/ui"],
    typedRoutes: true,
    crossOrigin: "anonymous",
    reactStrictMode: true,
    webpack: (
      config,
      { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
    ) => {
      // PWA stuff is strictly client thing,
      // therefore no need to have it in the server bundle
      if (isServer) {
        return config;
      }

      const name = process.env.NEXT_PUBLIC_SITE_TITLE;

      if (!name) {
        throw new Error("No name was provided to PWA manifest.");
      }

      const plugin = new PWAWebpackPlugin({ name, short_name: name });

      config.plugins.push(plugin);

      return config;
    },
  };

  return nextConfig;
}

export default createNextConfig;
