import { createBlockComponent } from "#components/meta";
import { ButtonBase, type IButtonBaseProps } from "./base";

interface IProps
  extends Omit<IButtonBaseProps, "type" | "onClick">,
    Pick<Required<IButtonBaseProps>, "onClick"> {}

export const Button = createBlockComponent(undefined, Component);

function Component({ className, ...props }: IProps) {
  return <ButtonBase type="button" {...props} />;
}
