import type { IServerConfiguration } from "./types";

export function getConfiguration(): IServerConfiguration {
  const symbol = Symbol.for("server-config")
    // @ts-expect-error
  const config: IServerConfiguration = globalThis[symbol]

  return config
}
