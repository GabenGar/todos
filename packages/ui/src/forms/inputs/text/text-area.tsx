import { forwardRef, type Ref } from "react";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";
import type { IInputProps } from "../input";

import styles from "./text-area.module.scss";

export interface IInputTextAreaProps
  extends Omit<
      IBaseComponentPropsWithChildren<"textarea">,
      "id" | "name" | "form"
    >,
    Pick<IInputProps, "id" | "name" | "form"> {}

export const InputTextArea = forwardRef<
  HTMLTextAreaElement,
  IInputTextAreaProps
>(createBlockComponent(styles, Component));

function Component(
  { rows = 2, ...props }: IInputTextAreaProps,
  ref?: Ref<HTMLTextAreaElement>,
) {
  return <textarea rows={rows} {...props} ref={ref} />;
}
