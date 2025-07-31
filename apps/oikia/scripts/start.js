import path from "node:path";
import { cwd } from "node:process";
import { pathToFileURL } from "node:url";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import { parseConfig } from "./lib/parse-configuration.mjs";

// Short-circuit the type-checking of the built output.
// the real modern way of handling file system paths in context of ESM
const BUILD_PATH = String(
  pathToFileURL(path.join(cwd(), "build", "server", "index.js"))
);

process.env.NODE_ENV = "production";

const config = await parseConfig();

// Setting it in such a hacky way to avoid reparsing
// within react router code
const configSymbol = Symbol.for("server-config");
// @ts-expect-error
globalThis[configSymbol] = config;

const PORT = config.server.port;

const app = express();

app.use(compression());
app.disable("x-powered-by");

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

app.use(morgan("tiny"));

app.listen(PORT, () => {
  console.log(`Production server is running on http://localhost:${PORT}`);
});
