import type { ILocalizationEntities } from "#lib/localization";
import { createPlannedEventEditPageURL } from "#lib/urls";
import { createBlockComponent } from "#components/meta";
import { DescriptionList, DescriptionSection } from "#components";
import { ITranslatableProps, type ILocalizableProps } from "#components/types";
import { Heading } from "#components/heading";
import { DateTime } from "#components/date";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
  type IOverviewProps,
} from "#components/overview";
import { EntityDescription, EntityID } from "#components/entities";
import { List, ListItem } from "#components/list";
import { LinkButton } from "#components/link";
import type { IPlannedEvent } from "./types";

interface IProps extends IOverviewProps, ILocalizableProps, ITranslatableProps {
  translation: ILocalizationEntities["planned_event"];
  plannedEvent: IPlannedEvent;
}

export const PlannetEventOverview = createBlockComponent(undefined, Component);

function Component({
  language,
  commonTranslation,
  translation,
  plannedEvent,
  ...props
}: IProps) {
  const { id, title, description, created_at, updated_at } = plannedEvent;

  return (
    <Overview {...props}>
      {(headinglevel) => (
        <>
          <OverviewHeader>
            <Heading level={headinglevel}>{title}</Heading>
            <EntityID
              commonTranslation={commonTranslation}
              entityID={String(id)}
            />
          </OverviewHeader>

          <OverviewBody>
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
          </OverviewBody>

          <OverviewFooter>
            <List>
              <ListItem>
                <LinkButton href={createPlannedEventEditPageURL(language, id)}>
                  {commonTranslation.entity["Edit"]}
                </LinkButton>
              </ListItem>
            </List>
          </OverviewFooter>
        </>
      )}
    </Overview>
  );
}
