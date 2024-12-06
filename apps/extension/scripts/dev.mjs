import concurrently from "concurrently";

develop();

async function develop() {
  concurrently(
    [
      {
        name: "web-ext",
        command: "web-ext run --no-config-discovery --config=web-ext-config.mjs",
      },
      {
        name: "extension",
        command: "webpack --config webpack.dev.js --watch",
      },
    ],
    {
      killOthers: "failure",
    },
  );
}
