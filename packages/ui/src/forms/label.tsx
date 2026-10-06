import type { ReactNode } from "react";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";
//

import styles from "./label.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"label"> {
  separator?: ReactNode;
}

export const Label = createBlockComponent(styles, Component);

function Component({ children, separator = ":", ...props }: IProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: no explanation
    <label {...props}>
      {children}
      {separator}
    </label>
  );
}
