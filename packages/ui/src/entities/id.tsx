import { createBlockComponent, type IBaseComponentProps } from "@repo/ui/meta";
import { ButtonCopy } from "#buttons";
import type { IEntityItem } from "#entities";
import { Preformatted } from "#formatting";
//

import styles from "./id.module.scss";

interface IProps extends IBaseComponentProps<"div"> {
  entityID: IEntityItem["id"];
}

export const EntityID = createBlockComponent(styles, Component);

function Component({ entityID, ...props }: IProps) {
  return (
    <div {...props}>
      <Preformatted className={styles.id}>{entityID}</Preformatted>
      <ButtonCopy className={styles.button} valueToCopy={entityID} />
    </div>
  );
}
