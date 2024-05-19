import type { ILocalizationEntities } from "#lib/localization";
import { createPlannedEventPageURL } from "#lib/urls";
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
import { Link } from "#components/link";
import type { ITranslatableProps, ILocalizableProps } from "#components/types";
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
  const { id, title, description } = plannedEvent;

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
