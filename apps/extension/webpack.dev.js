const {
  getHTMLPlugins,
  getOutput,
  getCopyPlugins,
  getFirefoxCopyPlugins,
  getEntry,
  getMiniCssExtractPlugin,
} = require("./webpack.utils");
const path = require("path");
const config = require("./config.json");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

/**
 * @type {import("webpack").Configuration}
 */
const generalConfig = {
  mode: "development",
  watch: true,
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js|jsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              esModule: false,
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
};

/**
 * @type {import("webpack").Configuration[]}
 */
const configs = [
  {
    ...generalConfig,
    entry: getEntry(config.chromePath),
    output: getOutput("chrome", config.devDirectory),
    plugins: [
      ...getMiniCssExtractPlugin(),
      ...getHTMLPlugins("chrome", config.devDirectory, config.chromePath),
      ...getCopyPlugins("chrome", config.devDirectory, config.chromePath),
    ],
  },
  {
    ...generalConfig,
    entry: getEntry(config.firefoxPath),
    output: getOutput("firefox", config.devDirectory),
    plugins: [
      ...getMiniCssExtractPlugin(),
      ...getFirefoxCopyPlugins(
        "firefox",
        config.devDirectory,
        config.firefoxPath
      ),
      ...getHTMLPlugins("firefox", config.devDirectory, config.firefoxPath),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerHost: "127.0.0.1",
        analyzerPort: 8888,
      }),
    ],
  },
];

module.exports = configs;
