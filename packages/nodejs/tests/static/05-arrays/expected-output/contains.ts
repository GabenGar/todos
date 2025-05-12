export interface IContains
  extends Array<
    | {
        id: number;
        title: string;
        description?: string;
      }
    | boolean
  > {}
