import { createBlockComponent } from "#components/meta";
import { ButtonBase, type IButtonBaseProps } from "./base";

export interface IButtonProps
  extends Omit<IButtonBaseProps, "type" | "onClick">,
    Pick<Required<IButtonBaseProps>, "onClick"> {}

export const Button = createBlockComponent(undefined, Component);

function Component({ className, ...props }: IButtonProps) {
  return <ButtonBase type="button" {...props} />;
}
