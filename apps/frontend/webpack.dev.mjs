// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";
import { merge } from "webpack-merge";
import commonConfiguration from "./webpack.common.mjs";

const { EnvironmentPlugin } = webpack;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, "public");

/**
 * @type {import("webpack").Configuration}
 */
const devConfig = {
  name: "dev-config",
  mode: "development",
  watch: true,
  devtool: "inline-source-map",
  plugins: [
    new EnvironmentPlugin({
      // add this one so it wouldn't error in dev
      // due to opaque parsing error
      NEXT_PUBLIC_SERVICE_WORKER_STATIC_ASSETS_PATHS: null,
      NEXT_PUBLIC_SERVICE_WORKER_STATIC_ASSETS_HASH: null
    }),
  ],
  output: {
    path: outputPath,
    filename: "[name].js",
  },
};

const finalConfig = merge(commonConfiguration, devConfig);

export default finalConfig;
