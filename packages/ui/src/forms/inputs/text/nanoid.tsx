import { createBlockComponent } from "#meta";
import { type IInputTextProps, InputText } from "./text";

interface IInputNanoIDProps
  extends Omit<IInputTextProps, "minLength" | "maxLength"> {}

export const InputNanoID = createBlockComponent(undefined, Component);

function Component({ ...props }: IInputNanoIDProps) {
  return <InputText minLength={21} maxLength={21} {...props} />;
}
