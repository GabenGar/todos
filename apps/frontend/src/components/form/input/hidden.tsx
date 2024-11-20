import { createBlockComponent } from "@repo/ui/meta";
import { Input, type IInputProps } from "./input";

export interface IInputHiddenProps extends IInputProps {}

export const InputHidden = createBlockComponent(undefined, Component);

function Component({ ...props }: IInputHiddenProps) {
  return <Input type="hidden" {...props} />;
}
