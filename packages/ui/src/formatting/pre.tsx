import clsx from "clsx";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "@repo/ui/meta";

import styles from "./pre.module.scss";

export interface IPreformattedProps extends IBaseComponentPropsWithChildren<"pre"> {
  isCode?: boolean;
}

export const Preformatted = createBlockComponent(styles, Component);

function Component({ isCode, className, ...props }: IPreformattedProps) {
  return <pre className={clsx(className, isCode && styles.code)} {...props} />;
}
