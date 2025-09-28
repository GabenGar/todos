

import { useState } from "react";
import type { IEntityItem } from "#lib/entities";
import { logError } from "#lib/logs";
import { createBlockComponent } from "@repo/ui/meta";
import { Button } from "#components/button";
import { Pre } from "#components/pre";
import type {
  IBaseComponentProps,
  ITranslatableProps,
} from "#components/types";

import styles from "./id.module.scss";

interface IProps extends IBaseComponentProps<"div">, ITranslatableProps {
  entityID: IEntityItem["id"];
}

export const EntityID = createBlockComponent(styles, Component);

function Component({ entityID, commonTranslation, ...props }: IProps) {
  const [isCopied, switchCopiedStatus] = useState(false);

  return (
    <div {...props}>
      <Pre className={styles.id}>{entityID}</Pre>
      <Button
        className={styles.button}
        disabled={isCopied}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(entityID);
            switchCopiedStatus(true);
            setTimeout(() => {
              switchCopiedStatus(false);
            }, 3000);
          } catch (error) {
            logError(error);
          }
        }}
      >
        {!isCopied
          ? commonTranslation.entity["Copy"]
          : commonTranslation.entity["Copied"]}
      </Button>
    </div>
  );
}
