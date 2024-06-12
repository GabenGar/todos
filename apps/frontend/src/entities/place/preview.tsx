import type { ILocalization } from "#lib/localization";
import { createPlacePageURL } from "#lib/urls";
import { DescriptionList, DescriptionSection } from "#components";
import { EntityDescription, EntityID } from "#components/entities";
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
import { ITranslatableProps, type ILocalizableProps } from "#components/types";
import type { IPlace } from "./types";

import styles from "./preview.module.scss";

interface IProps extends ILocalizableProps, ITranslatableProps, IPreviewProps {
  translation: ILocalization["place"];
  place: IPlace;
}

/**
 * @TODO total tasks count
 */
export const PlacePreview = createBlockComponent(styles, Component);

function Component({
  language,
  commonTranslation,
  translation,
  place,
  ...props
}: IProps) {
  const { id, title, description } = place;

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
                dValue={
                  <EntityDescription>
                    {description ?? translation.no_description}
                  </EntityDescription>
                }
              />
            </DescriptionList>
          </PreviewBody>

          <PreviewFooter>
            <Link
              className={styles.link}
              href={createPlacePageURL(language, id)}
            >
              {translation.details}
            </Link>
          </PreviewFooter>
        </>
      )}
    </Preview>
  );
}
