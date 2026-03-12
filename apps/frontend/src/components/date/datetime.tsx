import { useState } from "react";
import { createBlockComponent } from "@repo/ui/meta";
import { Button } from "#components/button";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import { useClient, useTranslation } from "#hooks";
import { formatDateTime } from "#lib/dates";
import { logError } from "#lib/logs";
//

import styles from "./datetime.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"div"> {
  dateTime: string;
}

/**
 * @TODO formatting options
 */
export const DateTime = createBlockComponent(styles, Component);

function Component({ dateTime, children, ...props }: IProps) {
  const { t } = useTranslation("common");
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
        {t((t) => (!isCopied ? t.datetime["Copy"] : t.datetime["Copied"]))}
      </Button>
    </div>
  );
}
