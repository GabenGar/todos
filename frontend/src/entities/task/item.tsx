import type { ILocalization } from "#lib/localization";
import { DescriptionList, DescriptionSection } from "#components";
import { Link } from "#components/link";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";
import { DateTime } from "#components/date";
import { Heading, type IHeadingLevel } from "#components/heading";
import { TaskStatus } from "./status";
import type { ITask } from "./types";

import styles from "./item.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"li"> {
  translation: ILocalization["todos"];
  task: ITask;
  headingLevel: IHeadingLevel;
}

/**
 * @TODO rewrite as a card component
 */
export const TaskItem = createBlockComponent(styles, Component);

function Component({ translation, task, headingLevel, ...props }: IProps) {
  const { id, created_at, title, description, status } = task;

  return (
    <li {...props} className={styles.block}>
      <Heading level={headingLevel}>{title}</Heading>
      <ul>
        <li>
          <DescriptionList>
            <DescriptionSection
              isHorizontal
              dKey={translation.status}
              dValue={
                <TaskStatus
                  translation={translation.status_values}
                  status={status}
                />
              }
            />
          </DescriptionList>
        </li>
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
