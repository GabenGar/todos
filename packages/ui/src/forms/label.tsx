import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";

import styles from "./label.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"label"> {}

export const Label = createBlockComponent(styles, Component);

function Component({ children, ...props }: IProps) {
  // biome-ignore lint/a11y/noLabelWithoutControl: no explanation
  return <label {...props}>{children}:</label>;
}
