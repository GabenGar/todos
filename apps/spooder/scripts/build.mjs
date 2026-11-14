// @ts-check
import fs from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import concurrently from "concurrently";

const exampleConfigName = "web-ext-config.example.mjs";
const configName = "web-ext-config.mjs";
const exampleConfigPath = path.join( cwd(), exampleConfigName );
const configPath = path.join( cwd(), configName );

build();

async function build() {
  // create a config if it doesn't exist
  try {
    await fs.stat( configPath );
    console.log( `Config already exists.` );
  } catch ( _error ) {
    await fs.copyFile( exampleConfigPath, configPath );
  }

  concurrently(
    [
      {
        name: "webpack-build",
        command: "webpack --config webpack.prod.mjs",
      },
      {
        name: "extension-build",
        command:
          "web-ext build --no-config-discovery --config=./web-ext-config.mjs --source-dir=build --artifacts-dir=dist",
      },
    ],
    {
      killOthersOn: "failure",
      maxProcesses: 1,
    },
  );
}
