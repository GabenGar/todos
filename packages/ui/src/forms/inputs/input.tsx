import { forwardRef, type Ref } from "react";
import { createBlockComponent, type IBaseComponentProps } from "#meta";
import type { IRequiredSome } from "@repo/ui/types";

import styles from "./input.module.scss";

interface IInputBaseProps
  extends IRequiredSome<
    IBaseComponentProps<"input">,
    "id" | "name" | "form" | "type"
  > {}

export interface IInputProps extends Omit<IInputBaseProps, "type"> {}

export const Input = forwardRef<HTMLInputElement, IInputBaseProps>(
  createBlockComponent(styles, Component),
);

function Component(
  { ...blockProps }: IInputBaseProps,
  ref?: Ref<HTMLInputElement>,
) {
  return <input {...blockProps} ref={ref} />;
}
