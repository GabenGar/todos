import { ILocalization } from "#lib/localization";
import { createTaskPageURL } from "#lib/urls";
import { DescriptionList } from "#components";
import { EntityID } from "#components/entities";
import { Heading } from "#components/heading";
import { createBlockComponent } from "#components/meta";
import {
  type IPreviewProps,
  Preview,
  PreviewBody,
  PreviewHeader,
  PreviewFooter,
} from "#components/preview";
import { DateTime } from "#components/date";
import type { IPlace } from "./types";
import { Link } from "#components/link";

import styles from "./preview.module.scss";

interface IProps extends IPreviewProps {
  translation: ILocalization["place"];
  place: IPlace;
}

export const PlacePreview = createBlockComponent(styles, Component);

function Component({ translation, place, ...props }: IProps) {
  const { id, title, description, created_at, updated_at } = place;

  return (
    <Preview {...props}>
      {(headingLevel) => (
        <>
          <PreviewHeader>
            <Heading level={headingLevel}>{title}</Heading>
            <EntityID>{id}</EntityID>
          </PreviewHeader>

          <PreviewBody>
            <DescriptionList
              sections={[
                [
                  translation.description,
                  description ?? translation.no_description,
                ],
              ]}
            />
            <DescriptionList
              sections={[
                [
                  translation.created_at,
                  <DateTime key="created_at" dateTime={created_at} />,
                ],
                [
                  translation.updated_at,
                  <DateTime key="updated_at" dateTime={updated_at} />,
                ],
              ]}
            />
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
