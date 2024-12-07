import {
  createBlockComponent,
  IBaseComponentPropsWithChildren,
} from "@repo/ui/meta";

import styles from "./label.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"label"> {}

export const Label = createBlockComponent(styles, Component);

function Component({ ...props }: IProps) {
  return <label {...props} />;
}
