// @ts-check
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

/**
 * @type {import("webpack").Configuration}
 */
const commonConfiguration = {
  target: "web",
  entry: {
    popup: "./src/popup/index.tsx",
    options: "./src/options/index.tsx",
    // content: "./src/content/index.tsx",
    background: "./src/background/index.ts",
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
          from: "./src/assets",
          to: "./assets",
        },
        {
          from: "./src/_locales",
          to: "./_locales",
        },
        {
          from: "./src/manifest.json",
          to: "./manifest.json",
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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              esModule: false,
            },
          },
          ,
          "sass-loader",
        ],
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
};

export default commonConfiguration;
