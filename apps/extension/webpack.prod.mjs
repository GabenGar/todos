// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import { merge } from "webpack-merge";
import commonConfiguration from "./webpack.common.mjs";

// @ts-expect-error
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @type {import("webpack").Configuration}
 */
const prodConfig = {
  mode: "production",
  devtool: "source-map",
  optimization: {
    moduleIds: "deterministic",
    minimize: false,
    runtimeChunk: false,
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name]/[name].js",
  },
};

const finalConfig = merge(commonConfiguration, prodConfig);

export default finalConfig;
