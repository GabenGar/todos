import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import { InputFile } from "../input";
import { Label } from "../label";

interface IProps extends IBaseComponentPropsWithChildren<"div"> {
  id: string;
  name: string;
  form: string;
}

export const InputSectionFile = createBlockComponent(undefined, Component);

function Component({ id, name, form, children, ...props }: IProps) {
  return (
    <div {...props}>
      <Label htmlFor={id}>{children}</Label>
      <InputFile id={id} name={name} form={form} />
    </div>
  );
}
