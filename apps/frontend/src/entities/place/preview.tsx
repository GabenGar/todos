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
import { createPlacePageURL } from "#lib/urls";
import type { IPlace } from "./types";
import { useTranslation } from "#hooks";
//

import styles from "./preview.module.scss";

interface IProps extends ILocalizableProps, IPreviewProps {
  place: IPlace;
}

/**
 * @TODO total tasks count
 */
export const PlacePreview = createBlockComponent(styles, Component);

function Component({ language, place, ...props }: IProps) {
  const { t } = useTranslation("translation");
  const { id, title, description } = place;

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
                dKey={t((t) => t.place.description)}
                dValue={
                  <EntityDescription>
                    {description ?? t((t) => t.place.no_description)}
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
              {t((t) => t.place.details)}
            </Link>
          </PreviewFooter>
        </>
      )}
    </Preview>
  );
}
