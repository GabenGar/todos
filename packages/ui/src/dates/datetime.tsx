"use client";

import { useState } from "react";
import { useClient } from "#hooks";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";
import { Button } from "#buttons";
import { formatDateTime } from "./format";

import styles from "./datetime.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"div"> {
  dateTime: string;
}

/**
 * @TODO formatting options
 */
export const DateTimeView = createBlockComponent(styles, Component);

function Component({ dateTime, children, ...props }: IProps) {
  const clientInfo = useClient();
  const [isCopied, switchCopiedStatus] = useState(false);
  const formattedDateTime = !clientInfo.isClient
    ? dateTime
    : formatDateTime(clientInfo.locale, dateTime);

  return (
    <div {...props}>
      <time className={styles.datetime} dateTime={dateTime}>
        {children ?? formattedDateTime}
      </time>

      <Button
        className={styles.button}
        disabled={isCopied}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(dateTime);
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
