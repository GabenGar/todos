import express from "express";
import morgan from "morgan";
import { parseConfig } from "./lib/parse-configuration.mjs";

process.env.NODE_ENV = "development";

const config = await parseConfig(true);

// Setting it in such a hacky way to avoid reparsing
// within react router code
const configSymbol = Symbol.for("server-config");
// @ts-expect-error
globalThis[configSymbol] = config;

const PORT = config.server.port;

const app = express();

app.disable("x-powered-by");

console.log("Starting development server...");

const viteDevServer = await import("vite").then((vite) =>
  vite.createServer({
    server: { middlewareMode: true },
  })
);

app.use(viteDevServer.middlewares);
app.use(async (req, res, next) => {
  try {
    const source = await viteDevServer.ssrLoadModule("./backend/app.ts");
    const resolvedApp = await source.createApp();

    return await resolvedApp(req, res, next);
  } catch (error) {
    if (typeof error === "object" && error instanceof Error) {
      viteDevServer.ssrFixStacktrace(error);
    }
    next(error);
  }
});

app.use(morgan("tiny"));

app.listen(PORT, () => {
  console.log(`Development server is running on http://localhost:${PORT}`);
});
