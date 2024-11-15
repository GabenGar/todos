const CopyWebpackPlugin = require("copy-webpack-plugin");
const {
  getHTMLPlugins,
  getOutput,
  getCopyPlugins,
  getZipPlugin,
  getFirefoxCopyPlugins,
  getMiniCssExtractPlugin,
  getEntry,
} = require("./webpack.utils");
const path = require("path");
const config = require("./config.json");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const extVersion = require("./src/manifest-chrome.json").version;
const ffExtVersion = require("./src/manifest-firefox.json").version;

/**
 * @type {import("webpack").Configuration}
 */
const generalConfig = {
  mode: "production",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      src: path.resolve(__dirname, "src/"),
      "webextension-polyfill":
        "webextension-polyfill/dist/browser-polyfill.min.js",
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
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
    output: getOutput("chrome", config.tempDirectory),
    entry: getEntry(config.chromePath),
    optimization: {
      minimize: true,
    },
    plugins: [
      new CleanWebpackPlugin(["dist", "temp"]),
      ...getMiniCssExtractPlugin(),
      ...getHTMLPlugins("chrome", config.tempDirectory, config.chromePath),
      ...getCopyPlugins("chrome", config.tempDirectory, config.chromePath),
      getZipPlugin(
        `${config.extName}-for-chrome-${extVersion}`,
        config.distDirectory
      ),
    ],
  },
  {
    ...generalConfig,
    entry: getEntry(config.firefoxPath),
    output: getOutput("firefox", config.tempDirectory),
    optimization: {
      minimize: true,
    },
    plugins: [
      new CleanWebpackPlugin(["dist", "temp"]),
      ...getMiniCssExtractPlugin(),
      ...getHTMLPlugins("firefox", config.tempDirectory, config.firefoxPath),
      ...getFirefoxCopyPlugins(
        "firefox",
        config.tempDirectory,
        config.firefoxPath
      ),
      getZipPlugin(
        `${config.extName}-for-firefox-${ffExtVersion}`,
        config.distDirectory
      ),
    ],
  },
  {
    mode: "production",
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src/"),
      },
    },
    entry: { other: path.resolve(__dirname, `src/background/background.js`) },
    output: getOutput("copiedSource", config.tempDirectory),
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `src`,
            to: path.resolve(
              __dirname,
              `${config.tempDirectory}/copiedSource/src/`
            ),
            info: { minimized: true },
          },
          {
            from: "*",
            to: path.resolve(
              __dirname,
              `${config.tempDirectory}/copiedSource/`
            ),
            globOptions: {
              ignore: ["**/BACKERS.md", "**/crowdin.yml"],
            },
          },
        ],
      }),
      getZipPlugin(
        `copiedSource-${config.extName}-${ffExtVersion}`,
        config.distDirectory,
        "other/"
      ),
    ],
  },
];

module.exports = configs;