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
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name]/[name].js",
  },
};

const finalConfig = merge(commonConfiguration, prodConfig);

export default finalConfig;
