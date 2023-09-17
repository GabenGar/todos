import { createBlockComponent } from "#components/meta";
import { Input, type IInputProps } from "./input";

interface IProps extends IInputProps {}

export const InputText = createBlockComponent(undefined, Component);

function Component({ ...props }: IProps) {
  return <Input type="text" {...props} />;
}
