/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
 */
export class CustomError extends Error {
  constructor( message: string, options?: ErrorOptions ) {
    super( message, options );

    // Maintains proper stack trace for where our error was thrown (non-standard)
    // biome-ignore lint/suspicious/noTsIgnore: just monorepo things
    // @ts-ignore `@repo/ui` is upset over this
    if ( Error.captureStackTrace ) {
      // biome-ignore lint/suspicious/noTsIgnore: just monorepo things
      // @ts-ignore `@repo/ui` is upset over this
      Error.captureStackTrace( this, CustomError );
    }
  }
}
