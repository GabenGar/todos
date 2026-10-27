// @ts-check

/**
 * @type {import("./web-ext-config").IWebExtConfig}
 */
const config = {
  sourceDir: "src",
  artifactsDir: "dist",
  ignoreFiles: [
    "node_modules",
    "web-ext-config.mjs",
    "build",
    "dist",
    "report.html",
  ],
  run: {
    startUrl: [
      "about:debugging#/runtime/this-firefox",
      "https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json",
    ],
    pref: [
      // disable popup for autostart
      "browser.startup.windowsLaunchOnLogin.disableLaunchOnLoginPrompt=true",
      // enable resist fingerprinting
      "privacy.resistFingerprinting=true",
      "privacy.resistFingerprinting.target_video_res=720",
      // disable language change popup due to aforementioned fingerprinting option
      "intl.accept_languages=en-US, en",
      // do not show the loicense popup
      "termsofuse.bypassNotification=true",
      // normalize font sizes
      "font.minimum-size.x-cyrillic=18",
      "font.minimum-size.x-western=18",
    ],
  },
  lint: {
    output: "json",
    pretty: true,
    metadata: true,
    selfHosted: true
  },
  build: {
    overwriteDest: true,
  },
};

export default config;
