export type IAPIResponse<DataShape> =
  | ISuccessfulAPIResponse<DataShape>
  | IFailedAPIResponse;

export interface ISuccessfulAPIResponse<DataShape> {
  is_successful: true;
  data: DataShape;
}

export interface IFailedAPIResponse {
  is_successful: false;
  errors: IAPIError[];
}

export interface IAPIError {
  name: string;
  message: string;
}
