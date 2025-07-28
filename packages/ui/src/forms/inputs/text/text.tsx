import { createBlockComponent } from "#meta";
import { type IInputProps, Input } from "../input";

export interface IInputTextProps extends IInputProps {}

export const InputText = createBlockComponent(undefined, Component);

function Component({ ...props }: IInputTextProps) {
  return <Input type="text" {...props} />;
}
