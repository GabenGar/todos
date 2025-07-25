import { createBlockComponent } from "#meta";
import { BIGINT_ONE } from "#numbers/bigint";
import { InputNumber, type IInputNumberProps } from "./number";

export interface IInputIntegerProps extends Omit<IInputNumberProps, "step"> {}

export const InputInteger = createBlockComponent(undefined, Component);

function Component({ ...props }: IInputIntegerProps) {
  return <InputNumber {...props} step={BIGINT_ONE} />;
}
