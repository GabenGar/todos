import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";

import styles from "./pre.module.scss";

interface IPreProps extends IBaseComponentPropsWithChildren<"pre"> {}

export const Pre = createBlockComponent(styles, Component);

function Component({ ...props }: IPreProps) {
  return <pre {...props} />;
}
