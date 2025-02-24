import { createRequestHandler } from "@react-router/express";
import express from "express";
import "react-router";
import { runMigrations } from "#server/database";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

export const app = startServer();

async function startServer() {
  await runMigrations();

  const app = express();

  app.use(
    createRequestHandler({
      // @ts-expect-error - virtual module provided by React Router at build time
      build: () => import("virtual:react-router/server-build"),
      getLoadContext() {
        return {
          VALUE_FROM_EXPRESS: "Hello from Express",
        };
      },
    })
  );

  return app;
}
