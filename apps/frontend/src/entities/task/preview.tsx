import type { ILocalization } from "#lib/localization";
import { createPlacePageURL, createTaskPageURL } from "#lib/urls";
import { DescriptionList, DescriptionSection } from "#components";
import { Heading } from "#components/heading";
import { createBlockComponent } from "#components/meta";
import {
  Preview,
  type IPreviewProps,
  PreviewHeader,
  PreviewBody,
  PreviewFooter,
} from "#components/preview";
import { DateTime } from "#components/date";
import { Link } from "#components/link";
import { EntityID } from "#components/entities";
import type { ITranslatableProps } from "#components/types";
import { TaskStatus } from "./status";
import type { ITask } from "./types";

import styles from "./preview.module.scss";

interface IProps extends ITranslatableProps, IPreviewProps {
  task: ITask;
  translation: ILocalization["task"];
}

/**
 * @TODO
 * allow to hide specific fields, i.e. no point
 * showing place link in a list of tasks for the place.
 */
export const TaskPreview = createBlockComponent(styles, Component);

function Component({ commonTranslation, translation, task, ...props }: IProps) {
  const { id, title, description, status, created_at, updated_at, place } =
    task;

  return (
    <Preview {...props}>
      {(headingLevel) => (
        <>
          <PreviewHeader>
            <Heading level={headingLevel}>{title}</Heading>
          </PreviewHeader>

          <PreviewBody>
            <EntityID commonTranslation={commonTranslation} entityID={id} />
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

              <DescriptionSection
                dKey={translation.description}
                dValue={description ?? translation.no_description}
              />

              <DescriptionSection
                dKey={translation.place}
                dValue={
                  !place ? (
                    translation.place_unknown
                  ) : (
                    <Link href={createPlacePageURL(place.id)} target="_blank">
                      {place.title ?? translation.place_unknown} ({place.id})
                    </Link>
                  )
                }
              />
            </DescriptionList>

            <DescriptionList>
              <DescriptionSection
                dKey={translation.creation_date}
                dValue={
                  <DateTime
                    commonTranslation={commonTranslation}
                    dateTime={created_at}
                  />
                }
              />

              <DescriptionSection
                dKey={translation.last_updated}
                dValue={
                  <DateTime
                    commonTranslation={commonTranslation}
                    dateTime={updated_at}
                  />
                }
              />
            </DescriptionList>
          </PreviewBody>

          <PreviewFooter>
            <Link className={styles.link} href={createTaskPageURL(id)}>
              {translation.details}
            </Link>
          </PreviewFooter>
        </>
      )}
    </Preview>
  );
}
