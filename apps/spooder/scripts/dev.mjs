// @ts-check
import concurrently from "concurrently";

develop();

async function develop() {
  concurrently(
    [
      {
        name: "extension",
        command: "webpack --config webpack.dev.mjs",
      },
      {
        name: "web-ext",
        command:
          "web-ext run --no-config-discovery --config=web-ext-config.mjs --source-dir=dev",
      },
    ],
    {
      restartTries: 3,
      restartDelay: 5000,
      killOthers: "failure",
    },
  );
}
