// @ts-check

/**
 * @type {import("./web-ext-config").IWebExtConfig}
 */
const config = {
  ignoreFiles: ["node_modules", "web-ext-config.js"],
  run: {
    startUrl: [
      "about:debugging#/runtime/this-firefox",
      "http://localhost:8001",
    ],
  },
  lint: {
    output: "json",
    pretty: true,
    metadata: true
  },
  build: {
    overwriteDest: true,
  },
};

export default config;
