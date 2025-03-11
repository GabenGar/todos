import { data } from "react-router";
import {
  createFailedAPIResponse,
  createSuccessfullAPIResponse,
} from "#server/lib/api";
import type { ISuccessfulAPIResponse } from "#lib/api";

export function createServerAction<
  // biome-ignore lint/suspicious/noExplicitAny: functions require `any` for generics to be useful
  ActionFunc extends (...args: any[]) => Promise<any>,
>(actionFunc: ActionFunc) {
  async function serverAction(
    ...args: Parameters<typeof actionFunc>
  ): Promise<
    Awaited<
      | ISuccessfulAPIResponse<ReturnType<typeof actionFunc>>
      | ReturnType<typeof data<ReturnType<typeof createFailedAPIResponse>>>
    >
  > {
    try {
      const data = await actionFunc(...args);

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
