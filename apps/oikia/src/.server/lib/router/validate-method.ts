import type { IFormMethod } from "#components/forms";
import { ClientError } from "../errors";

export function parseMethod<Method extends IFormMethod>(
  request: Request,
  allowedMethods: Method | Method[],
): Method {
  const isValidMethod =
    typeof allowedMethods === "string"
      ? request.method === allowedMethods
      : allowedMethods.includes(request.method as Method);

  if (!isValidMethod) {
    throw new ClientError(`Unknown method "${request.method}".`);
  }

  return request.method as Method;
}
