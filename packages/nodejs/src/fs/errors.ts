import { isError } from "#errors";

/**
 * NodeJS doesn't export [`SystemError`][1] class,
 * therefore this interface.
 *
 * [1]: https://nodejs.org/api/errors.html#class-systemerror
 */
export interface ISystemError {
  /**
   * The string error code.
   */
  code: string;
  /**
   * The system-provided error number.
   */
  errno: number;
  /**
   * A system-provided human-readable description of the error.
   */
  message: string;
  /**
   * The name of the system call that triggered the error.
   */
  syscall: string;
  /**
   * The file path destination when reporting a file system error.
   */
  dest?: string;
  /**
   * Extra details about the error condition.
   */
  info?: Record<string, unknown>;
  /**
   * The file path when reporting a file system error.
   */
  path?: string;
  /**
   * The address to which a network connection failed.
   */
  address?: string;
  /**
   * The network connection port that is not available.
   */
  port?: number;
}

interface IFileSystemError extends Omit<ISystemError, "address" | "port"> {
  path: string;
}

export function isSystemError(error: unknown): error is ISystemError {
  if (!isError(error)) {
    return false;
  }

  if (
    "code" in error &&
    "errno" in error &&
    "message" in error &&
    "syscall" in error
  ) {
    return true;
  }

  return false;
}

export function isFileSystemError(error: unknown): error is IFileSystemError {
  if (!isSystemError(error)) {
    return false;
  }

  if ("path" in error) {
    return true;
  }

  return false;
}
