import { createBlockComponent } from "@repo/ui/meta";
import { DescriptionList, DescriptionSection } from "#components";
import { DateTime } from "#components/date";
import { EntityDescription, EntityID } from "#components/entities";
import { Heading } from "#components/heading";
import { LinkButton } from "#components/link";
import { List, ListItem } from "#components/list";
import {
  type IOverviewProps,
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
} from "#components/overview";
import type { ILocalizableProps } from "#components/types";
import { useTranslation } from "#hooks";
import { createPlannedEventEditPageURL } from "#lib/urls";
import type { IPlannedEvent } from "./types";

interface IProps extends IOverviewProps, ILocalizableProps {
  plannedEvent: IPlannedEvent;
}

export const PlannetEventOverview = createBlockComponent(undefined, Component);

function Component({ language, plannedEvent, ...props }: IProps) {
  const { t } = useTranslation("translation");
  const { t: cT } = useTranslation("common");
  const { id, title, description, created_at, updated_at } = plannedEvent;

  return (
    <Overview {...props}>
      {(headinglevel) => (
        <>
          <OverviewHeader>
            <Heading level={headinglevel}>{title}</Heading>
            <EntityID entityID={String(id)} />
          </OverviewHeader>

          <OverviewBody>
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
          </OverviewBody>

          <OverviewFooter>
            <List>
              <ListItem>
                <LinkButton href={createPlannedEventEditPageURL(language, id)}>
                  {cT((t) => t.entity["Edit"])}
                </LinkButton>
              </ListItem>
            </List>
          </OverviewFooter>
        </>
      )}
    </Overview>
  );
}
