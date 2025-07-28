import { forwardRef, type Ref } from "react";
import { createBlockComponent } from "#meta";
import { type IInputProps, Input } from "./input";

export interface IInputFileProps extends IInputProps {}

export const InputFile = forwardRef<HTMLInputElement, IInputFileProps>(
  createBlockComponent(undefined, Component),
);

function Component(
  { ...blockProps }: IInputFileProps,
  ref?: Ref<HTMLInputElement>,
) {
  return <Input ref={ref} type="file" {...blockProps} />;
}
