export interface INestedObject {
  id: {
    type: string;
    value: string;
  };
  title?: string;
  [index: string]: unknown;
}
