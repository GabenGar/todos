import { createBlockComponent } from "#meta";
import { Input, type IInputProps } from "../input";

export interface IInputDateTimeProps
  extends Omit<
    IInputProps,
    "minLength" | "maxLength"
  > {
}

export const InputDateTime = createBlockComponent(undefined, Component);

function Component({
  ...props
}: IInputDateTimeProps) {

  return (
    <Input
      type="datetime-local"
      {...props}
    />
  );
}
