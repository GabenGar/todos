// @ts-check
import { merge } from "webpack-merge";
import commonConfiguration from "./webpack.common.mjs";

/**
 * @type {import("webpack").Configuration}
 */
const devConfig = {
  name: "dev-config",
  mode: "development",
  watch: true,
  devtool: "inline-source-map",
};

const finalConfig = merge(commonConfiguration, devConfig);

export default finalConfig;
