import concurrently from "concurrently";

develop();

async function develop() {
  concurrently(
    [
      {
        name: "web-ext",
        command: "web-ext run --no-config-discovery --config=web-ext-config.mjs --source-dir=dev",
      },
      {
        name: "extension",
        command: "webpack --config webpack.dev.mjs",
      },
    ],
    {
      killOthers: "failure",
    },
  );
}
