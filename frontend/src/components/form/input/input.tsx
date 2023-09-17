import { forwardRef, type Ref } from "react";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentProps } from "#components/types";
import type { IRequiredSome } from "#types";

import styles from "./html.module.scss";

interface IInputBaseProps
  extends IRequiredSome<
    IBaseComponentProps<"input">,
    "id" | "name" | "form" | "type"
  > {}

export interface IInputProps extends Omit<IInputBaseProps, "type"> {}

export const Input = forwardRef<HTMLInputElement, IInputBaseProps>(
  createBlockComponent(styles.block, Component),
);

function Component(
  { ...blockProps }: IInputBaseProps,
  ref?: Ref<HTMLInputElement>,
) {
  return <input {...blockProps} ref={ref} />;
}
