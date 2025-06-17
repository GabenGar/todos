import { forwardRef, type Ref } from "react";
import { createBlockComponent } from "#meta";
import { Input, type IInputProps } from "./input";

export interface IInputHiddenProps
  extends Omit<
    IInputProps,
    | "id"
    | "readOnly"
    | "required"
    | "disabled"
    | "list"
    | "pattern"
    | "placeholder"
  > {}

export const InputHidden = forwardRef<HTMLInputElement, IInputHiddenProps>(
  createBlockComponent(undefined, Component)
);

function Component(
  { ...props }: IInputHiddenProps,
  ref?: Ref<HTMLInputElement>
) {
  return <Input ref={ref} type="hidden" {...props} />;
}
