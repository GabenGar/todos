import log from "loglevel";
import { getSettings } from "../settings/settings";

let isInited = false;
export function overWriteLogLevel() {
  if (isInited) return;
  isInited = true;

  const originalFactory = log.methodFactory;
  log.methodFactory = (methodName, logLevel, loggerName) => {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);

    return (logDir, ...args) => {
      rawMethod(`[${methodName}]`, `${logDir}:`, ...args);
    };
  };
}

export function updateLogLevel() {
  const isDebugMode = getSettings("isDebugMode");

  if (isDebugMode) {
    log.enableAll(false);
  } else {
    log.disableAll(false);
  }
}
