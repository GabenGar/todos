import { createBlockComponent } from "@repo/ui/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import type { IRequiredSome } from "@repo/ui/types";
//

import styles from "./label.module.scss";

interface IProps
  extends IRequiredSome<IBaseComponentPropsWithChildren<"label">, "htmlFor"> {}

export const Label = createBlockComponent(styles, Component);

function Component({ ...props }: IProps) {
  // biome-ignore lint/a11y/noLabelWithoutControl: blah
  return <label {...props} />;
}
