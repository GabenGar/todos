import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import { type IInputFileProps, InputFile } from "../input";
import { Label } from "../label";

import styles from "./file.module.scss";

interface IProps
  extends Omit<IBaseComponentPropsWithChildren<"div">, "id" | "form" | "name">,
    Pick<IInputFileProps, "id" | "form" | "name" | "accept" | "multiple"> {}

export const InputSectionFile = createBlockComponent(styles, Component);

function Component({
  id,
  name,
  form,
  accept,
  multiple,
  children,
  ...props
}: IProps) {
  return (
    <div {...props}>
      <InputFile
        id={id}
        className={styles.input}
        name={name}
        form={form}
        accept={accept}
        multiple={multiple}
      />
      <Label className={styles.label} htmlFor={id}>{children}</Label>
    </div>
  );
}
