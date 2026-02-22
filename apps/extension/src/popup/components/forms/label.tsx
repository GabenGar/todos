import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "@repo/ui/meta";
//

import styles from "./label.module.scss";
import type { IRequiredSome } from "@repo/ui/types";

interface IProps
  extends IRequiredSome<IBaseComponentPropsWithChildren<"label">, "htmlFor"> {}

export const Label = createBlockComponent(styles, Component);

function Component({ ...props }: IProps) {
  // biome-ignore lint/a11y/noLabelWithoutControl: it is associated
  return <label {...props} />;
}
