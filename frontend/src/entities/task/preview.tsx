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
import { TaskStatus } from "./status";
import type { ITask } from "./types";

import styles from "./preview.module.scss";

interface IProps extends IPreviewProps {
  task: ITask;
  translation: ILocalization["task"];
}

export const TaskPreview = createBlockComponent(styles, Component);

function Component({ task, translation, ...props }: IProps) {
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
                      &quot;{place.title ?? translation.place_unknown}&quot; (
                      {place.id})
                    </Link>
                  )
                }
              />
            </DescriptionList>

            <DescriptionList>
              <DescriptionSection
                dKey={translation.creation_date}
                dValue={<DateTime dateTime={created_at} />}
              />

              <DescriptionSection
                dKey={translation.last_updated}
                dValue={<DateTime dateTime={updated_at} />}
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
