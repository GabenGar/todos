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
import type { ILocalizableProps } from "#components/types";
import { useTranslation } from "#hooks";
import { createPlannedEventPageURL } from "#lib/urls";
import type { IPlannedEvent } from "./types";

interface IProps extends ILocalizableProps, IPreviewProps {
  plannedEvent: IPlannedEvent;
}

export const PlannedEventPreview = createBlockComponent(undefined, Component);

function Component({ language, plannedEvent, ...props }: IProps) {
  const { t } = useTranslation("translation");
  const { id, title, description, created_at, updated_at } = plannedEvent;

  return (
    <Preview {...props}>
      {(headingLevel) => (
        <>
          <PreviewHeader>
            <Heading level={headingLevel}>{title}</Heading>
            <EntityID entityID={String(id)} />
          </PreviewHeader>

          <PreviewBody>
            <DescriptionList>
              <DescriptionSection
                dKey={t((t) => t.planned_event["Description"])}
                dValue={
                  !description ? (
                    t((t) => t.planned_event["No description provided"])
                  ) : (
                    <EntityDescription>{description}</EntityDescription>
                  )
                }
              />
            </DescriptionList>

            <DescriptionList>
              <DescriptionSection
                dKey={t((t) => t.planned_event["Date of creation"])}
                dValue={<DateTime dateTime={created_at} />}
              />
              <DescriptionSection
                dKey={t((t) => t.planned_event["Last updated"])}
                dValue={<DateTime dateTime={updated_at} />}
              />
            </DescriptionList>
          </PreviewBody>

          <PreviewFooter>
            <Link href={createPlannedEventPageURL(language, id)}>
              {t((t) => t.planned_event["Details"])}
            </Link>
          </PreviewFooter>
        </>
      )}
    </Preview>
  );
}
