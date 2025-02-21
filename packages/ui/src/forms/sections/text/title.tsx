import { createBlockComponent } from "#meta";
import { type IInputSectionTextProps, InputSectionText } from "./text";

interface IProps
  extends Omit<IInputSectionTextProps, "minLength" | "maxLength"> {}

export const InputSectionTitle = createBlockComponent(undefined, Component);

function Component({ ...props }: IProps) {
  return <InputSectionText {...props} minLength={1} maxLength={256} />;
}
