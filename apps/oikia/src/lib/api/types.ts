export type IAPIResponse<DataShape> =
  | ISuccessfulAPIResponse<DataShape>
  | IFailedAPIResponse;

export interface ISuccessfulAPIResponse<DataShape> {
  is_successfull: true;
  data: DataShape;
}

export interface IFailedAPIResponse {
  is_successfull: false;
  errors: IAPIError[];
}

export interface IAPIError {
  name: string;
  message: string;
}
