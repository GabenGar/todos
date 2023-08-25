import type { IBaseComponentPropsWithChildren } from "#components/types";
import type { ITodo } from "./types";

import styles from "./item.module.scss"

interface IProps extends IBaseComponentPropsWithChildren<"li"> {
  todo: ITodo;
  onRemoval: (id: ITodo["id"]) => Promise<void>
}

export function TodoItem({ todo, onRemoval, ...props }: IProps) {
  const { id, created_at, title, description } = todo;

  return (
    <li {...props} className={styles.block}>
      {created_at}
      <br />
      {title}
      <br />
      {description}
      <br />
      <button type="button" onClick={async () => onRemoval(id)}>Remove</button>
    </li>
  );
}
