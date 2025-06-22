import { ClientError } from "./client";

export class ClientInputError extends ClientError {
  constructor(message: string, cause?: Error) {
    super(message, { statusCode: 422, cause });
  }
}
