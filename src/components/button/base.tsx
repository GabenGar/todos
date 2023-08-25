import type { ComponentPropsWithoutRef } from "react";
import { createBlockComponent } from "#components/meta";

import styles from "./base.module.scss";

interface IProps extends ComponentPropsWithoutRef<"button"> {}

export const ButtonBase = createBlockComponent(styles, Component);

function Component({ ...props }: IProps) {
  return <button {...props} />;
}
