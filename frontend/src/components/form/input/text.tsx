import { createBlockComponent } from "#components/meta";
import { Input, type IInputProps } from "./input";

export interface IInputTextProps extends IInputProps {}

export const InputText = createBlockComponent(undefined, Component);

function Component({ ...props }: IInputTextProps) {
  return <Input type="text" {...props} />;
}
