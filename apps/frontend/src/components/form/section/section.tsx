import { createBlockComponent } from "@repo/ui/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import type { IInputProps } from "../input";

import styles from "./section.module.scss";

interface IFormSectionProps
  extends Omit<IBaseComponentPropsWithChildren<"div">, "id"> {}

export interface IInputSectionProps
  extends Omit<IFormSectionProps, "id">,
    Pick<
      IInputProps,
      | "id"
      | "form"
      | "name"
      | "required"
      | "defaultValue"
      | "readOnly"
      | "disabled"
    > {}

export const InputSection = createBlockComponent(styles, Component);

function Component({ ...blockProps }: IFormSectionProps) {
  return <div {...blockProps} />;
}
