export interface IArrayItems
  extends Array<{
    id: number;
    title: string;
    description?: string;
  }> {}
