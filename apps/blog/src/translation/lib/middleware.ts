import { createMiddleware } from "@tanstack/react-start";

export const translationMiddleware = createMiddleware().server(
  async ({ next, request, pathname }) => {
    const result = await next();

    return result;
  },
);
