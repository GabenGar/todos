import { useState } from "react";
import { createBlockComponent } from "@repo/ui/meta";
import { Button } from "#components/button";
import { Pre } from "#components/pre";
import type { IBaseComponentProps } from "#components/types";
import { useTranslation } from "#hooks";
import type { IEntityItem } from "#lib/entities";
import { logError } from "#lib/logs";
//

import styles from "./id.module.scss";

interface IProps extends IBaseComponentProps<"div"> {
  entityID: IEntityItem["id"];
}

export const EntityID = createBlockComponent(styles, Component);

function Component({ entityID, ...props }: IProps) {
  const { t } = useTranslation("common");
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
        {t((t) => (!isCopied ? t.entity["Copy"] : t.entity["Copied"]))}
      </Button>
    </div>
  );
}
