import { createBlockComponent } from "#components/meta";
import type { IBaseComponentProps } from "#components/types";

export interface IInputFileProps extends Omit<IBaseComponentProps<"input">, "type"> {
  id: string;
  form: string;
  name: string;
}

export const InputFile = createBlockComponent(undefined, Component);

function Component({ ...blockProps }: IInputFileProps) {
  return <input type="file" {...blockProps} />;
}
