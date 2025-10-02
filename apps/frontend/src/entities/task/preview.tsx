import type { ILocalization } from "#lib/localization";
import { createPlacePageURL, createTaskPageURL } from "#lib/urls";
import { DescriptionList, DescriptionSection } from "#components";
import { Heading } from "#components/heading";
import { createBlockComponent } from "@repo/ui/meta";
import {
  Preview,
  type IPreviewProps,
  PreviewHeader,
  PreviewBody,
  PreviewFooter,
} from "#components/preview";
import { Link } from "#components/link";
import { EntityDescription, EntityID } from "#components/entities";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
import { TaskStatus } from "./status";
import type { ITask } from "./types";

import styles from "./preview.module.scss";

interface IProps extends ILocalizableProps, ITranslatableProps, IPreviewProps {
  task: ITask;
  translation: ILocalization["pages"]["task"];
}

/**
 * @TODO
 * allow to hide specific fields, i.e. no point
 * showing place link in a list of tasks for the place.
 */
export const TaskPreview = createBlockComponent(styles, Component);

function Component({
  language,
  commonTranslation,
  translation,
  task,
  ...props
}: IProps) {
  const { id, title, description, status, place } = task;

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
                dValue={
                  !description ? (
                    translation.no_description
                  ) : (
                    <EntityDescription>{description}</EntityDescription>
                  )
                }
              />

              <DescriptionSection
                dKey={translation.place}
                dValue={
                  !place ? (
                    translation.place_unknown
                  ) : (
                    <Link
                      href={createPlacePageURL(language, place.id)}
                      target="_blank"
                    >
                      {place.title ?? translation.place_unknown} ({place.id})
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
              {translation.details}
            </Link>
          </PreviewFooter>
        </>
      )}
    </Preview>
  );
}
