import { createBlockComponent } from "@repo/ui/meta";
import { DescriptionList, DescriptionSection } from "#components";
import { EntityDescription, EntityID } from "#components/entities";
import { Heading } from "#components/heading";
import { Link } from "#components/link";
import {
  type IPreviewProps,
  Preview,
  PreviewBody,
  PreviewFooter,
  PreviewHeader,
} from "#components/preview";
import type { ILocalizableProps } from "#components/types";
import { useTranslation } from "#hooks";
import { createPlacePageURL, createTaskPageURL } from "#lib/urls";
import { TaskStatus } from "./status";
import type { ITask } from "./types";
//

import styles from "./preview.module.scss";

interface IProps extends ILocalizableProps, IPreviewProps {
  task: ITask;
}

/**
 * @TODO
 * allow to hide specific fields, i.e. no point
 * showing place link in a list of tasks for the place.
 */
export const TaskPreview = createBlockComponent(styles, Component);

function Component({ language, task, ...props }: IProps) {
  const { t } = useTranslation("translation");
  const { id, title, description, status, place } = task;

  return (
    <Preview {...props}>
      {(headingLevel) => (
        <>
          <PreviewHeader>
            <Heading level={headingLevel}>{title}</Heading>
          </PreviewHeader>

          <PreviewBody>
            <EntityID entityID={id} />
            <DescriptionList>
              <DescriptionSection
                isHorizontal
                dKey={t((t) => t.task.status)}
                dValue={<TaskStatus status={status} />}
              />

              <DescriptionSection
                dKey={t((t) => t.task.description)}
                dValue={
                  !description ? (
                    t((t) => t.task.no_description)
                  ) : (
                    <EntityDescription>{description}</EntityDescription>
                  )
                }
              />

              <DescriptionSection
                dKey={t((t) => t.task.place)}
                dValue={
                  !place ? (
                    t((t) => t.task.place_unknown)
                  ) : (
                    <Link
                      href={createPlacePageURL(language, place.id)}
                      target="_blank"
                    >
                      {place.title ?? t((t) => t.task.place_unknown)} (
                      {place.id})
                    </Link>
                  )
                }
              />
            </DescriptionList>
          </PreviewBody>

          <PreviewFooter>
            <Link
              className={styles.link}
              href={createTaskPageURL(language, id)}
            >
              {t((t) => t.task.details)}
            </Link>
          </PreviewFooter>
        </>
      )}
    </Preview>
  );
}
