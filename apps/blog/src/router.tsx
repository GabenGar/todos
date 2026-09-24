import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  // @ts-expect-error it requires some "context"
  // but its values are derived from request path
  // and are async.
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}
