// @ts-check
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { merge } from "webpack-merge";
import commonConfiguration from "./webpack.common.mjs";

async function createProdConfig() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outputPath = path.resolve(__dirname, "out");

  // doing dev worker output cleanup here
  // because setting up an adhoc script is a gigantic pain
  const devOutputPath = path.join(__dirname, "public");
  const devWorkerPath = path.resolve(devOutputPath, "service-worker.js");
  const devWorkerMapPath = path.resolve(devOutputPath, "service-worker.js.map");

  await fs.rm(devWorkerPath, { force: true });
  await fs.rm(devWorkerMapPath, { force: true });

  /**
   * @type {import("webpack").Configuration}
   */
  const prodConfig = {
    name: "prod-config",
    mode: "production",
    devtool: "source-map",
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

export default createProdConfig;
