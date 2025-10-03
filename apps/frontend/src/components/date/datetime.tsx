import { useState } from "react";
import { formatDateTime } from "#lib/dates";
import { logError } from "#lib/logs";
import { useClient } from "#hooks";
import { createBlockComponent } from "@repo/ui/meta";
import { Button } from "#components/button";
import type {
  IBaseComponentPropsWithChildren,
  ITranslatableProps,
} from "#components/types";

import styles from "./datetime.module.scss";

interface IProps
  extends IBaseComponentPropsWithChildren<"div">,
    ITranslatableProps {
  dateTime: string;
}

/**
 * @TODO formatting options
 */
export const DateTime = createBlockComponent(styles, Component);

function Component({
  commonTranslation,
  dateTime,
  children,
  ...props
}: IProps) {
  const client = useClient();
  const [isCopied, switchCopiedStatus] = useState(false);
  const formattedDateTime = !client
    ? dateTime
    : formatDateTime(client.locale, dateTime);

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
            logError(error);
          }
        }}
      >
        {!isCopied
          ? commonTranslation.datetime["Copy"]
          : commonTranslation.datetime["Copied"]}
      </Button>
    </div>
  );
}
