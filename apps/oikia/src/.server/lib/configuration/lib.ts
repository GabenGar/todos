import type { IConfiguration } from "./types";

export function getConfiguration(): IConfiguration {
  const symbol = Symbol.for("server-config");
  // @ts-expect-error just global namespace juggling
  const config: IConfiguration = globalThis[symbol];

  return config;
}
