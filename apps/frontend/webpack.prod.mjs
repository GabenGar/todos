// @ts-check
import { platform } from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import webpack from "webpack";
import { merge } from "webpack-merge";
import commonConfiguration from "./webpack.common.mjs";

const { EnvironmentPlugin } = webpack;
const isWindows = platform() === "win32";

async function createProdConfig() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outputPath = path.resolve(__dirname, "out");
  const staticPaths = await collectStaticPaths(outputPath);

  /**
   * @type {import("webpack").Configuration}
   */
  const prodConfig = {
    name: "prod-config",
    mode: "production",
    devtool: "source-map",
    plugins: [
      new EnvironmentPlugin({
        NEXT_PUBLIC_SERVICE_WORKER_STATIC_ASSETS_PATHS: Array.from(staticPaths),
      }),
    ],
    optimization: {
      runtimeChunk: false,
    },
    output: {
      path: outputPath,
      filename: "[name].js",
    },
  };

  const finalConfig = merge(commonConfiguration, prodConfig);

  return finalConfig;
}

/**
 * @param {string} outputPath
 *
 */
async function collectStaticPaths(outputPath) {
  const folder = await fs.opendir(outputPath, {
    recursive: true,
    encoding: "utf-8",
  });

  /**
   * @type {Set<string>}
   */
  const staticPaths = new Set();

  for await (const dirEntry of folder) {
    const isValidFile =
      dirEntry.isFile()
      // service worker doesn't like caching itself
      && dirEntry.name !== "service-worker.js";
    if (!isValidFile) {
      continue;
    }

    const isHTMLFile = dirEntry.name.endsWith(".html");
    const isIndexHTMLFile = !isHTMLFile
      ? false
      : dirEntry.name === "index.html";
    const normalizedName = !isHTMLFile
      ? dirEntry.name
      : !isIndexHTMLFile
        ? dirEntry.name.replace(".html", "")
        : dirEntry.name.replace("index.html", "");
    const fullPath = path.join(dirEntry.parentPath, normalizedName);
    const relativeOutputPath = path.relative(outputPath, fullPath);
    const normalizedPath = !isWindows
      ? relativeOutputPath
      : relativeOutputPath.split(path.sep).join(path.posix.sep);

    staticPaths.add(normalizedPath);
  }

  return staticPaths;
}

export default createProdConfig;
