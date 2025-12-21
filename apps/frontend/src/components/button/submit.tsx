import { createBlockComponent } from "@repo/ui/meta";
import { ButtonBase, type IButtonBaseProps } from "./base";

export interface IButtonSubmitProps
  extends Omit<IButtonBaseProps, "type" | "form">,
    Pick<Required<IButtonBaseProps>, "form"> {}

export const ButtonSubmit = createBlockComponent(undefined, Component);

function Component({
  viewType = "submit",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
