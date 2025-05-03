export interface IRecursiveRef {
  parent?: IRecursiveRef;
  children?: Array<IRecursiveRef>;
}
