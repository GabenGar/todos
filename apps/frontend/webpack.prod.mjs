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
  const devOutputPath = path.join(__dirname, "public");
  const devWorkerPath = path.resolve(devOutputPath, "service-worker.js");
  const devWorkerMapPath = path.resolve(devOutputPath, "service-worker.js.map");

  // doing dev worker output cleanup here
  // because setting up an adhoc script is a gigantic pain
  await fs.rm(devWorkerPath, { force: true });
  await fs.rm(devWorkerMapPath, { force: true });

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
        NEXT_PUBLIC_SERVICE_WORKER_STATIC_ASSETS_PATHS: staticPaths,
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
   * @type {string[]}
   */
  const staticPaths = [];

  for await (const dirEntry of folder) {
    if (!dirEntry.isFile()) {
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

    staticPaths.push(normalizedPath);
  }

  return staticPaths;
}

export default createProdConfig;
