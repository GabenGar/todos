export type IAPIResponse = ISuccessfulAPIResponse | IFailedAPIResponse;

export interface ISuccessfulAPIResponse {
  is_successfull: true;
}

export interface IFailedAPIResponse {
  is_successfull: false;
}
