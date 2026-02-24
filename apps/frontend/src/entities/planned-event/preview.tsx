import { createBlockComponent } from "@repo/ui/meta";
import { DescriptionList, DescriptionSection } from "#components";
import { DateTime } from "#components/date";
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
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
import type { ILocalizationEntities } from "#lib/localization";
import { createPlannedEventPageURL } from "#lib/urls";
import type { IPlannedEvent } from "./types";

interface IProps extends ILocalizableProps, ITranslatableProps, IPreviewProps {
  translation: ILocalizationEntities["planned_event"];
  plannedEvent: IPlannedEvent;
}

export const PlannedEventPreview = createBlockComponent(undefined, Component);

function Component({
  language,
  commonTranslation,
  translation,
  plannedEvent,
  ...props
}: IProps) {
  const { id, title, description, created_at, updated_at } = plannedEvent;

  return (
    <Preview {...props}>
      {(headingLevel) => (
        <>
          <PreviewHeader>
            <Heading level={headingLevel}>{title}</Heading>
            <EntityID
              commonTranslation={commonTranslation}
              entityID={String(id)}
            />
          </PreviewHeader>

          <PreviewBody>
            <DescriptionList>
              <DescriptionSection
                dKey={translation["Description"]}
                dValue={
                  !description ? (
                    translation["No description provided"]
                  ) : (
                    <EntityDescription>{description}</EntityDescription>
                  )
                }
              />
            </DescriptionList>

            <DescriptionList>
              <DescriptionSection
                dKey={translation["Date of creation"]}
                dValue={
                  <DateTime
                    commonTranslation={commonTranslation}
                    dateTime={created_at}
                  />
                }
              />
              <DescriptionSection
                dKey={translation["Last updated"]}
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
            <Link href={createPlannedEventPageURL(language, id)}>
              {translation["Details"]}
            </Link>
          </PreviewFooter>
        </>
      )}
    </Preview>
  );
}
