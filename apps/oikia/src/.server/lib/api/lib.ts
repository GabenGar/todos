import type {
  IAPIError,
  IFailedAPIResponse,
  ISuccessfulAPIResponse,
} from "#lib/api";

export function createSuccessfullAPIResponse<DataShape>(
  data: DataShape,
): ISuccessfulAPIResponse<DataShape> {
  return { is_successful: true, data };
}

export function createFailedAPIResponse(error: Error): IFailedAPIResponse {
  return {
    is_successful: false,
    errors: [createAPIError(error.name, error.message)],
  };
}

export function createAPIError(name: string, message: string): IAPIError {
  return {
    name,
    message,
  };
}
