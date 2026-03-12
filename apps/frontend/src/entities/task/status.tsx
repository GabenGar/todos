import { useTranslation } from "#hooks";
import type { ITask } from "./types";
//

import styles from "./status.module.scss";

interface IProps {
  status: ITask["status"];
}

export function TaskStatus({ status }: IProps) {
  const { t } = useTranslation("translation");

  return (
    <span className={styles[status]}>
      {t((t) => t.task.status_values[status])}
    </span>
  );
}
