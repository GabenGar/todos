import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import { useClient } from "#hooks";
import type { ITodo } from "../types";

import styles from "./item.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"li"> {
  todo: ITodo;
  onRemoval: (id: ITodo["id"]) => Promise<void>;
}

export const TodoItem = createBlockComponent(styles, Component);

function Component({ todo, onRemoval, ...props }: IProps) {
  const clientInfo = useClient();
  const { id, created_at, title, description } = todo;
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
    </li>
  );
}
