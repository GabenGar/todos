import { ILocalization } from "#lib/localization";
import { Link } from "#components/link";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import { DateTime } from "#components/date";
import type { ITodo } from "../types";

import styles from "./item.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"li"> {
  translation: ILocalization["todos"];
  task: ITodo;
  onRemoval: (id: ITodo["id"]) => Promise<void>;
}

export const TodoItem = createBlockComponent(styles, Component);

function Component({ translation, task, onRemoval, ...props }: IProps) {
  const { id, created_at, title, description } = task;

  return (
    <li {...props} className={styles.block}>
      <ul>
        <li>{title}</li>
        <li>{description}</li>
        <li>
          <DateTime dateTime={created_at} />
        </li>
        <li>
          <Link href={`/task/${id}`}>{translation.details}</Link>
        </li>
      </ul>
    </li>
  );
}
