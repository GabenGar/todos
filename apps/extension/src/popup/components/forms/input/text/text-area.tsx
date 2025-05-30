import {
  createBlockComponent,
  IBaseComponentPropsWithChildren,
} from "@repo/ui/meta";
import { type IInputProps } from "../input";

import styles from "./text-area.module.scss";

export interface IInputTextAreaProps
  extends Omit<
      IBaseComponentPropsWithChildren<"textarea">,
      "id" | "name" | "form"
    >,
    Pick<IInputProps, "id" | "name" | "form"> {}

export const InputTextArea = createBlockComponent(styles, Component);

function Component({ rows = 2, ...props }: IInputTextAreaProps) {
  return <textarea rows={rows} {...props} />;
}
