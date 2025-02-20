import { createBlockComponent } from "@repo/ui/meta";
import { type FormProps, Form as RouterForm } from "react-router";

interface IProps extends FormProps {}

export const Form = createBlockComponent(undefined, Component);

function Component({ ...props }: IProps) {
  return <RouterForm {...props} />;
}
