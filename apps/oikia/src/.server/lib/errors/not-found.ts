import { ClientError } from "./client";

export class NotFoundError extends ClientError {
  constructor(cause?: Error) {
    super("Not Found", { statusCode: 404, cause });
  }
}
