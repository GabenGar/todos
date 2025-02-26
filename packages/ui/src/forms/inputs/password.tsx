import { createBlockComponent } from "#meta";
import type { IRequiredSome } from "#types";
import { Input, type IInputProps } from "./input";

export interface IInputPasswordProps
  extends IRequiredSome<IInputProps, "minLength" | "maxLength"> {
  type: "text" | "password";
  autoComplete: "new-password" | "current-password" | "one-time-code";
}

export const InputPassword = createBlockComponent(undefined, Component);

function Component({ type, ...props }: IInputPasswordProps) {
  return <Input type={type} {...props} />;
}
