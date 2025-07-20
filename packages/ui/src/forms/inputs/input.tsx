import type { IRequiredSome } from "@repo/ui/types";
import { forwardRef, type Ref } from "react";
import { createBlockComponent, type IBaseComponentProps } from "#meta";

import styles from "./input.module.scss";

interface IInputBaseProps
  extends IRequiredSome<
    IBaseComponentProps<"input">,
    "name" | "form" | "type"
  > {}

export interface IInputProps
  extends Omit<IInputBaseProps, "id" | "type">,
    Pick<Required<IInputBaseProps>, "id"> {}

export const Input = forwardRef<HTMLInputElement, IInputBaseProps>(
  createBlockComponent(styles, Component),
);

function Component(
  { ...blockProps }: IInputBaseProps,
  ref?: Ref<HTMLInputElement>,
) {
  return <input {...blockProps} ref={ref} />;
}
