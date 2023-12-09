import type { ILocalization } from "#lib/localization";
import { createPlacePageURL } from "#lib/urls";
import { DescriptionList, DescriptionSection } from "#components";
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
import { Link } from "#components/link";
import { ITranslatableProps } from "#components/types";
import type { IPlace } from "./types";

import styles from "./preview.module.scss";

interface IProps extends ITranslatableProps, IPreviewProps {
  translation: ILocalization["place"];
  place: IPlace;
}

/**
 * @TODO total tasks count
 */
export const PlacePreview = createBlockComponent(styles, Component);

function Component({
  commonTranslation,
  translation,
  place,
  ...props
}: IProps) {
  const { id, title, description, created_at, updated_at } = place;

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
                dKey={translation.description}
                dValue={description ?? translation.no_description}
              />
            </DescriptionList>

            <DescriptionList>
              <DescriptionSection
                dKey={translation.created_at}
                dValue={
                  <DateTime
                    commonTranslation={commonTranslation}
                    key="created_at"
                    dateTime={created_at}
                  />
                }
              />
              <DescriptionSection
                dKey={translation.updated_at}
                dValue={
                  <DateTime
                    commonTranslation={commonTranslation}
                    key="updated_at"
                    dateTime={updated_at}
                  />
                }
              />
            </DescriptionList>
          </PreviewBody>

          <PreviewFooter>
            <Link className={styles.link} href={createPlacePageURL(id)}>
              {translation.details}
            </Link>
          </PreviewFooter>
        </>
      )}
    </Preview>
  );
}
