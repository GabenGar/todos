import { createBlockComponent } from "#components/meta";
import { ButtonBase, type IButtonBaseProps } from "./base";

interface IProps extends Omit<IButtonBaseProps, "type"> {}

export const Button = createBlockComponent(undefined, Component);

function Component({ className, ...props }: IProps) {
  return <ButtonBase type="button" {...props} />;
}
