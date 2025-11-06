// @ts-check
import { createHash } from "node:crypto";
import { platform } from "node:os";
import path from "node:path";
import { createReadStream } from "node:fs";
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

  const workerPath = path.resolve(outputPath, "service-worker.js");
  const workerMapPath = path.resolve(outputPath, "service-worker.js.map");

  // all this logic technically runs before webpack cleans up anything
  // therefore delete the output of the previous build
  // so it won't get included into hash and the cache paths
  await fs.rm(workerPath, { force: true });
  await fs.rm(workerMapPath, { force: true });

  const staticPaths = await collectStaticPaths(outputPath);
  const assetsHash = await getAssetsHash(staticPaths);
  /**
   * @type {import("webpack").Configuration}
   */
  const prodConfig = {
    name: "prod-config",
    mode: "production",
    devtool: "source-map",
    plugins: [
      new EnvironmentPlugin({
        NEXT_PUBLIC_SERVICE_WORKER_STATIC_ASSETS_PATHS: Array.from(
          staticPaths.keys(),
        ),
        NEXT_PUBLIC_SERVICE_WORKER_STATIC_ASSETS_HASH: assetsHash,
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
   * @type {Map<string, string>}
   */
  const staticPaths = new Map();

  for await (const dirEntry of folder) {
    const isValidFile =
      dirEntry.isFile() &&
      // service worker doesn't like caching itself
      dirEntry.name !== "service-worker.js";
    if (!isValidFile) {
      continue;
    }

    const filePath = path.join(dirEntry.parentPath, dirEntry.name);
    const fileHash = await getFileHashSHA256(filePath);
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

    staticPaths.set(normalizedPath, fileHash);
  }

  const sortedPaths = toSortedMap(staticPaths);

  return sortedPaths;
}

/**
 * Stolen from [stackoverflow answer][1].
 *
 * [1]: https://stackoverflow.com/a/79381731
 * @param {string} filePath
 * @returns {Promise<string>}
 */
async function getFileHashSHA256(filePath) {
  const hash = createHash("sha256");
  const stream = createReadStream(filePath);

  for await (const chunk of stream) {
    hash.update(chunk);
  }

  return hash.digest("hex");
}

/**
 * @param {Map<string, string>} paths
 * @returns string
 */
async function getAssetsHash(paths) {
  const hash = createHash("sha256");

  for await (const hashValue of paths.values()) {
    hash.update(hashValue);
  }

  return hash.digest("hex");
}

/**
 * @template {Map<unknown, unknown>} MapType
 * @param {MapType} inputMap
 * @returns {MapType}
 */
function toSortedMap(inputMap) {
  const sortedKeys = Array.from(inputMap.keys()).sort();
  const sortedMap = new Map();

  for (const key of sortedKeys) {
    sortedMap.set(key, inputMap.get(key));
  }

  // @ts-expect-error jsdoc and generic types do not behave
  return sortedMap;
}

export default createProdConfig;
