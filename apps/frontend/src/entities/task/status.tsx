import type { ILocalization } from "#lib/localization";
import type { ITask } from "./types";

import styles from "./status.module.scss";

interface IProps {
  translation: ILocalization["pages"]["task"]["status_values"];
  status: ITask["status"];
}

export function TaskStatus({ translation, status }: IProps) {
  return <span className={styles[status]}>{translation[status]}</span>;
}
