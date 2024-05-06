import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";

import styles from "./item.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"li"> {}

export const ListItem = createBlockComponent(styles, Component);

function Component(props: IProps) {
  return <li {...props} />;
}
