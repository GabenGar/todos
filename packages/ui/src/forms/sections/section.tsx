import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";
import type { IInputProps } from "../inputs";

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
