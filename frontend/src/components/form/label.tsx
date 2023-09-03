import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";

import styles from "./label.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"label"> {}

export const Label = createBlockComponent(styles, Component);

function Component({ ...props }: IProps) {
  return <label {...props} />;
}
