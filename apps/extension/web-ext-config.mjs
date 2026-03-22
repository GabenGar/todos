// @ts-check

/**
 * @type {import("./web-ext-config").IWebExtConfig}
 */
const config = {
  ignoreFiles: [
    "node_modules",
    "web-ext-config.js",
    "build",
    "dist",
    "report.html",
  ],
  run: {
    startUrl: [
      "about:debugging#/runtime/this-firefox",
      "http://localhost:8001",
      "http://localhost:8002",
      "http://localhost:9001",
    ],
    pref: [
      // do not show the loicense popup
      "termsofuse.bypassNotification=true",
      // normalize font sizes
      "font.minimum-size.x-cyrillic=18",
      "font.minimum-size.x-western=18"
    ]
  },
  lint: {
    output: "json",
    pretty: true,
    metadata: true,
  },
  build: {
    overwriteDest: true,
  },
};

export default config;
