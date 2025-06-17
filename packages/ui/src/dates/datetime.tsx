"use client";

import { useClient } from "#hooks";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";
import { ButtonCopy } from "#buttons";
import { Loading } from "#loading";
import { formatDateTime, formatRelativeDateTime } from "./format";

import styles from "./datetime.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"div"> {
  dateTime: string;
}

export const DateTimeView = createBlockComponent(styles, Component);

function Component({ dateTime, children, ...props }: IProps) {
  const client = useClient();

  return (
    <div {...props}>
      <time className={styles.datetime} dateTime={dateTime}>
        {children ? (
          children
        ) : !client ? (
          <Loading />
        ) : (
          <>
            {formatRelativeDateTime(client.locale, dateTime)} (
            {formatDateTime(client.locale, dateTime)})
          </>
        )}
      </time>

      <ButtonCopy className={styles.button} valueToCopy={dateTime} />
    </div>
  );
}
