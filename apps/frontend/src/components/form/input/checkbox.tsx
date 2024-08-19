import { createBlockComponent } from "#components/meta";
import { Input, type IInputProps } from "./input";

import styles from "./checkbox.module.scss"

export interface IInputCheckboxProps extends IInputProps {}

export const InputCheckbox = createBlockComponent(styles, Component);

function Component({ ...props }: IInputCheckboxProps) {
  return <Input type="checkbox" {...props} />;
}
