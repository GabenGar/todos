import { createBlockComponent } from "#components/meta";
import { IBaseComponentPropsWithChildren } from "#components/types";

import styles from "./id.module.scss"

interface IProps extends IBaseComponentPropsWithChildren<"div"> {}

export const EntityID = createBlockComponent(styles, Component);

function Component({...props}:IProps) {
  return <div {...props}/>
}
