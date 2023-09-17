import { createBlockComponent } from "#components/meta";
import { Input, IInputProps } from "./input";

export interface IInputFileProps extends IInputProps {}

export const InputFile = createBlockComponent(undefined, Component);

function Component({ ...blockProps }: IInputFileProps) {
  return <Input type="file" {...blockProps} />;
}
