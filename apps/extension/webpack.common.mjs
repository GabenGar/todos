// @ts-check
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

//@ts-ignore
import chromeManifest from "./src/manifest-chrome.json" assert { type: "json" };
//@ts-ignore
import firefoxManifest from "./src/manifest-firefox.json" assert { type: "json" };

const extVersion = chromeManifest.version;
const ffExtVersion = firefoxManifest.version;

/**
 * @type {import("webpack").Configuration}
 */
const commonConfiguration = {
  target: "web",
  entry: {
    popup: "./src/popup/index.tsx",
    options: "./src/options/index.tsx",
    // content: "./src/content/index.tsx",
    // background: "./src/background/background.ts",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]/[name].css",
    }),
    new HtmlWebpackPlugin({
      title: "Popup",
      filename: "popup/index.html",
      template: "./src/popup/index.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      title: "Options",
      filename: "options/index.html",
      template: "./src/options/index.html",
      chunks: ["options"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/assets/icons",
          to: "./dist/firefox/assets/icons",
        },
        {
          from: "./src/_locales",
          to: "./dist/firefox/_locales",
        },
        {
          from: "./src/manifest-firefox.json",
          to: "./dist/firefox/manifest.json",
        },
      ],
    }),
  ],
  module: {
    parser: {
      javascript: {
        strictExportPresence: true,
      },
    },
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  cache: {
    type: "filesystem",
  },
  output: {
    path: `./dist/firefox`,
    filename: "[name]/[name].js",
  },
};

export default commonConfiguration;
