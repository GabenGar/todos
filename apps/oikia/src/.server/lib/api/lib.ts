import type {
  IAPIError,
  IFailedAPIResponse,
  ISuccessfulAPIResponse,
} from "./types";

export function createSuccessfullAPIResponse<DataShape>(
  data: DataShape
): ISuccessfulAPIResponse<DataShape> {
  return { is_successfull: true, data };
}

export function createFailedAPIResponse(error: Error): IFailedAPIResponse {
  return {
    is_successfull: false,
    errors: [createAPIError(error.name, error.message)],
  };
}

export function createAPIError(name: string, message: string): IAPIError {
  return {
    name,
    message,
  };
}
