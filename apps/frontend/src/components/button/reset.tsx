import { createBlockComponent } from "@repo/ui/meta";
import { ButtonBase, type IButtonBaseProps } from "./base";

interface IBaseProps
  extends Omit<IButtonBaseProps, "type" | "form">,
    Pick<Required<IButtonBaseProps>, "form"> {}

export interface IButtonResetProps extends IBaseProps {}

export const ButtonReset = createBlockComponent(undefined, Component);

function Component({ viewType, children, ...blockProps }: IButtonResetProps) {
  return (
    <ButtonBase {...blockProps} type="reset" viewType={viewType ?? "reset"}>
      {children ?? "Reset"}
    </ButtonBase>
  );
}
