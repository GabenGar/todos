import { createStart } from "@tanstack/react-start";
import { translationMiddleware } from "#translation/lib";

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [translationMiddleware],
  };
});
