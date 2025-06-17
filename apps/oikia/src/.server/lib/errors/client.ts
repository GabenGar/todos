type IClientStatusCode =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451;

interface IClientErrorOptions extends ErrorOptions {
  statusCode?: IClientStatusCode;
}

interface IError extends Error {
  statusCode: IClientStatusCode;
}

/**
 * An error which is assumed to be sent to client.
 * For this reason message must not include server details.
 */
export class ClientError extends Error implements IError {
  statusCode: IClientStatusCode;
  constructor(message: string, options?: IClientErrorOptions) {
    super(message, options);

    this.statusCode = options?.statusCode ?? 400;
  }
}
