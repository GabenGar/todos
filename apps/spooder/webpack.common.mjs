// @ts-check
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

/**
 * @type {import("webpack").Configuration}
 */
const commonConfiguration = {
  target: "web",
  entry: {
    action: "./src/action/index.tsx",
    "content-script": "./src/content-script/index.ts"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]/[name].css",
    }),
    new HtmlWebpackPlugin({
      title: "Action",
      filename: "action/index.html",
      template: "./src/action/index.html",
      chunks: ["action"],
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
  output: {
    copy: [
        {
          from: "./src/icons",
          to: "./icons",
        },
        {
          from: "./src/_locales",
          to: "./_locales",
        },
        {
          from: "./src/manifest.json",
          to: "./",
        },
      ],
  }
};

export default commonConfiguration;
