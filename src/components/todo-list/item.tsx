import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import { Button } from "#components/button";
import type { ITodo } from "./types";

import styles from "./item.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"li"> {
  todo: ITodo;
  onRemoval: (id: ITodo["id"]) => Promise<void>;
}

export const TodoItem = createBlockComponent(styles, Component);

export function Component({ todo, onRemoval, ...props }: IProps) {
  const { id, created_at, title, description } = todo;

  return (
    <li {...props} className={styles.block}>
      {created_at}
      <br />
      {title}
      <br />
      {description}
      <br />
      <Button onClick={async () => onRemoval(id)}>Remove</Button>
    </li>
  );
}
