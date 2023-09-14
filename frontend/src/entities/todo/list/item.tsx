import { ILocalization } from "#lib/localization";
import { useClient } from "#hooks";
import { Link } from "#components/link";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import { Loading } from "#components";
import type { ITodo } from "../types";

import styles from "./item.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"li"> {
  translation: ILocalization["todos"];
  task: ITodo;
  onRemoval: (id: ITodo["id"]) => Promise<void>;
}

export const TodoItem = createBlockComponent(styles, Component);

function Component({ translation, task, onRemoval, ...props }: IProps) {
  const clientInfo = useClient();
  const { id, created_at, title, description } = task;
  const formattedDate = !clientInfo.isClient
    ? created_at
    : Intl.DateTimeFormat(String(clientInfo.locale)).format(
        new Date(created_at),
      );

  return (
    <li {...props} className={styles.block}>
      {title}
      <br />
      {description}
      <br />
      {formattedDate}
      <br />
      <Link href={`/task/${id}`}>{translation.details}</Link>
    </li>
  );
}
