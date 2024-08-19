import { createBlockComponent } from "#components/meta";
import { Input, type IInputProps } from "../input";

export interface IInputNumberProps extends IInputProps {
  defaultValue?: number;
}

export const InputNumber = createBlockComponent(undefined, Component);

function Component({ defaultValue, ...props }: IInputNumberProps) {
  return <Input type="number" defaultValue={defaultValue} {...props} />;
}
