// @ts-check
import webpack from "webpack";
import nextEnv from "@next/env";

const { EnvironmentPlugin } = webpack;
const projectDir = process.cwd();
nextEnv.loadEnvConfig(projectDir);

/**
 * @typedef ITSLoaderOptions
 * Taken from the [reference][1].
 *
 * [1]:https://github.com/6759814/29561893?tab=readme-ov-file#loader-options
 *
 * @property {string} [configFile]
 * Allows you to specify where to find the TypeScript configuration file.
 *
 * You may provide
 * - just a file name. The loader then will search for the config file of each entry point in the respective entry point's containing folder.
 * If a config file cannot be found there, it will travel up the parent directory chain and look for the config file in those folders.
 * - a relative path to the configuration file. It will be resolved relative to the respective `.ts` entry file.
 * - an absolute path to the configuration file.
 *
 * Please note, that if the configuration file is outside of your project directory, you might need to set the `context` option to avoid TypeScript issues (like TS18003).
 * In this case the `configFile` should point to the `tsconfig.json` and `context` to the project root.
 *
 * @property {Record<string, unknown>} [compilerOptions]
 * Allows overriding TypeScript options.
 *
 * Should be specified in the same format as you would do for the `compilerOptions` property in tsconfig.json.
 */

/**
 * @type {import("webpack").Configuration}
 */
const commonConfiguration = {
  name: "base-config",
  target: "web",
  entry: {
    "service-worker": {
      import: "./src/browser/workers/service-worker.ts",
    },
  },
  plugins: [
    new EnvironmentPlugin({
      VERCEL: null,
      VERCEL_ENV: null,
      VERCEL_URL: null,
      NEXT_PUBLIC_VERCEL_ENV: null,
      NEXT_PUBLIC_VERCEL_URL: null,
      NEXT_PUBLIC_SITE_TITLE: null,
      NEXT_PUBLIC_SITE_BASE_URL: null,
      NEXT_PUBLIC_REPOSITORY_URL: null,
      NEXT_PUBLIC_DEFAULT_LOG_LEVEL: null,
      NEXT_PUBLIC_IS_SERVICE_WORKER_ENABLED: null,
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
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          /**
           * @type {ITSLoaderOptions}
           */
          options: {
            configFile: "tsconfig.service-worker.json",
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
  cache: {
    type: "filesystem",
  },

};

export default commonConfiguration;
