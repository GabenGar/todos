import { data } from "react-router";
import type { ISuccessfulAPIResponse } from "#lib/api";
import {
  createFailedAPIResponse,
  createSuccessfullAPIResponse,
} from "#server/lib/api";

export function createServerLoader<
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
