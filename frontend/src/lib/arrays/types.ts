export type IArrayElement<ElementType> = ElementType extends ReadonlyArray<
  infer InferredType
>
  ? InferredType
  : ElementType;
