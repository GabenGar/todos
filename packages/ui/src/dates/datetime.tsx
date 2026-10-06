import { ButtonCopy } from "#buttons";
import { useClient } from "#hooks";
import { Loading } from "#loading";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";
//

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
            {client.formatRelativeDateTime(dateTime)} (
            {client.formatDateTime(dateTime)})
          </>
        )}
      </time>

      <ButtonCopy className={styles.button} valueToCopy={dateTime} />
    </div>
  );
}
