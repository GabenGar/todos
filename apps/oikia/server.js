import path from "node:path";
import { cwd } from "node:process";
import fs from "node:fs/promises";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import { lint, parser } from "@exodus/schemasafe";

/**
 * @typedef IConfiguration
 * @property {IServerConfiguration} server
 */

/**
 * @typedef IServerConfiguration
 * @property {number} port
 */

// Short-circuit the type-checking of the built output.
const BUILD_PATH = "./build/server/index.js";
const isDevelopment = process.env.NODE_ENV === "development";
const config = await parseConfig(isDevelopment);
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
  console.log("Starting development server..");

  const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    })
  );

  app.use(viteDevServer.middlewares);
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule("./server/app.ts");

      return await source.app(req, res, next);
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
  app.use(await import(BUILD_PATH).then((mod) => mod.app));
}

/**
 * @param {boolean} isDevelopment
 * @returns {Promise<IConfiguration>}
 */
async function parseConfig(isDevelopment) {
  const configBasePath = path.join(cwd(), "config");
  const configSchemaPath = path.join(configBasePath, "server.schema.json");
  const configPath = path.join(
    configBasePath,
    isDevelopment ? "server.development.json" : "server.json"
  );

  const schemaContent = await fs.readFile(configSchemaPath, {
    encoding: "utf-8",
  });
  /**
   * @type {import("@exodus/schemasafe").Schema}
   */
  const schema = JSON.parse(schemaContent);

  const schemaErrors = lint(schema, { mode: "strong" });

  if (schemaErrors.length !== 0) {
    throw new AggregateError(
      schemaErrors,
      "Failed to validate server configuration schema."
    );
  }

  const configParser = parser(schema, { includeErrors: true });

  const configContent = await fs.readFile(configPath, { encoding: "utf-8" });

  const result = configParser(configContent);

  if (!result.valid) {
    throw new Error("Failed to parse server configuration.", {
      cause: result.error,
    });
  }

  /**
   * @type {IConfiguration}
   */
  // @ts-expect-error just generic shit
  const config = result.value;

  return config;
}
