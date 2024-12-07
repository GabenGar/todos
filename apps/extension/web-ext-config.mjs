// @ts-check

/**
 * @type {import("./web-ext-config").IWebExtConfig}
 */
const config = {
  sourceDir: "dev/firefox",
  artifactsDir: "dev/firefox",
  ignoreFiles: ["node_modules", "web-ext-config.js"],
  run: {
    startUrl: [
      "about:debugging#/runtime/this-firefox",
      "http://localhost:8001",
    ],
  },
  build: {
    overwriteDest: true,
  },
};

export default config;
