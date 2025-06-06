import { parseArgs } from "node:util";
import compression from "compression";
import express from "express";
import morgan from "morgan";

import { parseConfig } from "./scripts/lib/parse-configuration.mjs";

// Short-circuit the type-checking of the built output.
const BUILD_PATH = "./build/server/index.js";
/**
 * @type {import("node:util").ParseArgsConfig}
 */
const cliOptions = {
  options: {
    environment: {
      type: "string",
    },
  },
};
const parsedArgs = parseArgs(cliOptions);
const environment = parsedArgs.values.environment;

if (environment !== "development" && environment !== "production") {
  throw new Error("Invalid value for option `--environment`.");
}

process.env.NODE_ENV = environment;

const isDevelopment = environment === "development";
const config = await parseConfig(isDevelopment);

// Setting it in such a hacky way to avoid reparsing
// within react router code
const configSymbol = Symbol.for("server-config");
// @ts-expect-error
globalThis[configSymbol] = config;

const PORT = config.server.port;

const app = express();

app.use(compression());
app.disable("x-powered-by");

if (isDevelopment) {
  await runDevelopmentServer(app);
} else {
  await runProductionServer(app);
}

app.use(morgan("tiny"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/**
 * @param {express.Express} app
 */
async function runDevelopmentServer(app) {
  console.log("Starting development server...");

  const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    })
  );

  app.use(viteDevServer.middlewares);
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule("./server/app.ts");
      const resolvedApp = await source.createApp();

      return await resolvedApp(req, res, next);
    } catch (error) {
      if (typeof error === "object" && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
}

/**
 * @param {express.Express} app
 */
async function runProductionServer(app) {
  console.log("Starting production server...");

  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
  app.use(express.static("build/client", { maxAge: "1h" }));
  app.use(
    await import(BUILD_PATH).then(
      async (serverModule) => await serverModule.createApp()
    )
  );
}
