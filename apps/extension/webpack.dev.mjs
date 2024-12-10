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
const devConfig = {
  mode: "development",
  watch: true,
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "dev"),
    filename: "[name]/[name].js",
  },
};

const finalConfig = merge(commonConfiguration, devConfig);

export default finalConfig;
