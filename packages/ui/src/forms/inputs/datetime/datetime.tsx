import { forwardRef, type Ref } from "react";
import { createBlockComponent } from "#meta";
import { type IInputProps, Input } from "../input";

export interface IInputDateTimeProps
  extends Omit<IInputProps, "minLength" | "maxLength"> {}

export const InputDateTime = forwardRef<HTMLInputElement, IInputDateTimeProps>(
  createBlockComponent(undefined, Component),
);

function Component(
  { ...props }: IInputDateTimeProps,
  ref?: Ref<HTMLInputElement>,
) {
  return <Input ref={ref} type="datetime-local" {...props} />;
}
