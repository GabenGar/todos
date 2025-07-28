"use client";

import { createBlockComponent, type IBaseComponentProps } from "@repo/ui/meta";
import { useState } from "react";
import { Button } from "#buttons";
import type { IEntityItem } from "#entities";
import { Preformatted } from "#formatting";

import styles from "./id.module.scss";

interface IProps extends IBaseComponentProps<"div"> {
  entityID: IEntityItem["id"];
}

export const EntityID = createBlockComponent(styles, Component);

function Component({ entityID, ...props }: IProps) {
  const [isCopied, switchCopiedStatus] = useState(false);

  return (
    <div {...props}>
      <Preformatted className={styles.id}>{entityID}</Preformatted>
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
            console.error(error);
          }
        }}
      >
        {!isCopied ? "Copy" : "Copied"}
      </Button>
    </div>
  );
}
