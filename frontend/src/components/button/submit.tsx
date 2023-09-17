import { createBlockComponent } from "#components/meta";
import { ButtonBase, type IButtonBaseProps } from "./base";

export interface IButtonSubmitProps
  extends Omit<IButtonBaseProps, "type" | "form">,
    Pick<Required<IButtonBaseProps>, "form"> {}

export const ButtonSubmit = createBlockComponent(undefined, Component);

function Component({
  viewType = "submit",
  className,
  children,
  ...blockProps
}: IButtonSubmitProps) {
  return (
    <ButtonBase type="submit" viewType={viewType} {...blockProps}>
      {children ?? "Submit"}
    </ButtonBase>
  );
}
