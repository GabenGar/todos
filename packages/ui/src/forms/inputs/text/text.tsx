import { forwardRef, type Ref } from "react";
import { createBlockComponent } from "#meta";
import { type IInputProps, Input } from "../input";

export interface IInputTextProps extends IInputProps {}

export const InputText = forwardRef<HTMLInputElement, IInputTextProps>(
  createBlockComponent(undefined, Component),
);

function Component({ ...props }: IInputTextProps, ref?: Ref<HTMLInputElement>) {
  return <Input type="text" {...props} ref={ref} />;
}
