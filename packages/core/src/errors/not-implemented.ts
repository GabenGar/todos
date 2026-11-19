import { CustomError } from "./custom.js";

export class NotImplementedError extends CustomError {
  constructor() {
    super( "Not implemented." );
  }
}
