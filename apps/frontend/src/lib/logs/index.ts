/**
 * @TODOs
 * - local storage log level
 * - implement [`pino`](https://github.com/pinojs/pino)
 */
import { DEFAULT_LOG_LEVEL } from "#environment";
import { toQuotedStrings } from "#lib/strings";

const LOG_LEVELS = ["debug", "log", "info", "warn", "error"] as const;
export type ILogLevel = (typeof LOG_LEVELS)[number];

validateLogLevel(DEFAULT_LOG_LEVEL);
let currentLogLevel = DEFAULT_LOG_LEVEL;

export function validateLogLevel(
  inputData: unknown,
): asserts inputData is ILogLevel {
  if (!LOG_LEVELS.includes(inputData as ILogLevel)) {
    const allowedValues = toQuotedStrings(LOG_LEVELS);

    throw new Error(
      `Unknown log level "${inputData}", allowed values: ${allowedValues}.`,
    );
  }
}

export const logDebug = createLogger("debug", console);
export const logMessage = createLogger("log", console);
export const logInfo = createLogger("info", console);
export const logWarning = createLogger("warn", console);
export const logError = createLogger("error", console);

/**
 * Change the current log level.
 * All logging functions called after it will
 */
export function changeCurrentLogLevel(nextlevel: ILogLevel): ILogLevel {
  if (nextlevel !== currentLogLevel) {
    currentLogLevel = nextlevel;
  }

  return currentLogLevel;
}

function createLogger(logLevel: ILogLevel, logger = console) {
  return (message: string | Error | unknown) => {
    const isLoggable =
      LOG_LEVELS.indexOf(logLevel, LOG_LEVELS.indexOf(currentLogLevel)) !== -1;
    isLoggable && logger[logLevel](message);
  };
}
