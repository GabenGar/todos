import { createMiddleware } from "@tanstack/react-start";
import { getLanguageFromPathname, getTranslation } from "./lib";

export const translationMiddleware = createMiddleware().server(
  async ({ next, pathname }) => {
    const language = getLanguageFromPathname(pathname);
    const translation = await getTranslation(language);
    const result = await next({
      context: {
        translation,
      },
    });

    return result;
  },
);
