import { data } from "react-router";
import {
  createFailedAPIResponse,
  createSuccessfullAPIResponse,
} from "#server/lib/api";
import type { ISuccessfulAPIResponse } from "#lib/api";

export function createServerLoader<
  // biome-ignore lint/suspicious/noExplicitAny: functions require `any` for generics to be useful
  ActionFunc extends (...args: any[]) => Promise<any>,
>(loaderFunc: ActionFunc) {
  async function serverAction(
    ...args: Parameters<typeof loaderFunc>
  ): Promise<
    | ReturnType<typeof data<ReturnType<typeof createFailedAPIResponse>>>
    | ISuccessfulAPIResponse<Awaited<ReturnType<typeof loaderFunc>>>
  > {
    try {
      const data = await loaderFunc(...args);

      return createSuccessfullAPIResponse(data);
    } catch (error) {
      return data(createFailedAPIResponse(error as Error), {
        headers: new Headers([["Content-Type", "application/json"]]),
        status: 500,
      });
    }
  }

  return serverAction;
}
