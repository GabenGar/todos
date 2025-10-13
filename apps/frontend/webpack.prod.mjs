// @ts-check
import { merge } from "webpack-merge";
import commonConfiguration from "./webpack.common.mjs";

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
};

const finalConfig = merge(commonConfiguration, prodConfig);

export default finalConfig;
