 ;

import { ButtonCopy, type IButtonCopyProps } from "#buttons";
import { useClient } from "#hooks";
import { Loading } from "#loading";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";
import { formatDateTime, formatRelativeDateTime } from "./format";
//

import styles from "./datetime.module.scss";

interface IProps
  extends IBaseComponentPropsWithChildren<"div">,
    Pick<IButtonCopyProps, "translation"> {
  dateTime: string;
}

export const DateTimeView = createBlockComponent(styles, Component);

function Component({ translation, dateTime, children, ...props }: IProps) {
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

      <ButtonCopy
        translation={translation}
        className={styles.button}
        valueToCopy={dateTime}
      />
    </div>
  );
}
