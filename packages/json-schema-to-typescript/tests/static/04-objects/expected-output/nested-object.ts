export interface INestedObject extends Record<string, unknown> {
  id: {
    type: string;
    value: string;
  };
  title?: string;
}
