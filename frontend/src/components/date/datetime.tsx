"use client";

import { formatDateTime } from "#lib/dates";
import { useClient } from "#hooks";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";

interface IProps extends IBaseComponentPropsWithChildren<"time"> {
  dateTime: string;
}

/**
 * @TODO formatting options
 */
export const DateTime = createBlockComponent(undefined, Component);

function Component({ dateTime, children, ...props }: IProps) {
  const clientInfo = useClient();
  const formattedDateTime = !clientInfo.isClient
    ? dateTime
    : formatDateTime(clientInfo.locale, dateTime);

  return (
    <time dateTime={dateTime} {...props}>
      {children ?? formattedDateTime}
    </time>
  );
}
