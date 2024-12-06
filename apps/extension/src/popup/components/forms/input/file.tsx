import { forwardRef, type Ref } from "react";
import { createBlockComponent } from "@repo/ui/meta";
import { Input, IInputProps } from "./input";

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
