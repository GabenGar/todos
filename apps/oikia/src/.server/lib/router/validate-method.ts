import type { IFormMethod } from "#components/forms";
import type { ICommonTranslation } from "#lib/internationalization";
import { ClientError } from "../errors";

export function parseMethod<Method extends IFormMethod>(
  request: Request,
  allowedMethods: Method | Method[],
  translation: ICommonTranslation,
): Method {
  const isValidMethod =
    typeof allowedMethods === "string"
      ? request.method === allowedMethods
      : allowedMethods.includes(request.method as Method);

  if (!isValidMethod) {
    throw new ClientError(
      `${translation["Unknown method"]} "${request.method}".`,
    );
  }

  return request.method as Method;
}
