// @ts-check
import fs from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import concurrently from "concurrently";

const exampleConfigName = "web-ext-config.example.mjs";
const configName = "web-ext-config.mjs";
const exampleConfigPath = path.join(cwd(), exampleConfigName);
const configPath = path.join(cwd(), configName);

develop();

async function develop() {
  // create a config if it doesn't exist
  try {
    await fs.stat(configPath);
    console.log(`Config already exists.`);
  } catch (_error) {
    await fs.copyFile(exampleConfigPath, configPath);
    
  }
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
      killOthersOn: "failure",
    },
  );
}
