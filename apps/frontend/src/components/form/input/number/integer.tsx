import { createBlockComponent } from "#components/meta";
import { InputNumber, IInputNumberProps } from "./number";

export interface IInputIntegerProps extends Omit<IInputNumberProps, "step"> {}

export const InputInteger = createBlockComponent(undefined, Component);

function Component({ ...props }: IInputIntegerProps) {
  return <InputNumber step={1} {...props} />;
}
