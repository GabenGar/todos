import { createBlockComponent } from "@repo/ui/meta";
import { DescriptionList, DescriptionSection } from "#components";
import { DateTime } from "#components/date";
import { EntityDescription, EntityID } from "#components/entities";
import { Heading, type IHeadingLevel } from "#components/heading";
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
import { TasksStats } from "#entities/task";
import { useTranslation } from "#hooks";
import { createPlaceEditPageURL } from "#lib/urls";
import type { IPlace } from "./types";
//

import styles from "./details.module.scss";

export interface IPlaceOverviewProps extends IOverviewProps, ILocalizableProps {
  place: IPlace;
}

export const PlaceOverview = createBlockComponent(styles, Component);

function Component({ language, place, ...props }: IPlaceOverviewProps) {
  const { t } = useTranslation("translation");
  const { id, title, description, created_at, updated_at } = place;

  return (
    <Overview {...props}>
      {(headinglevel) => (
        <>
          <OverviewHeader>
            <Heading level={headinglevel}>{title}</Heading>
            <EntityID className={styles.id} entityID={id} />
          </OverviewHeader>

          <OverviewBody>
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

            <DescriptionList>
              <DescriptionSection
                dKey={t((t) => t.place.created_at)}
                dValue={<DateTime dateTime={created_at} />}
              />
              <DescriptionSection
                dKey={t((t) => t.place.updated_at)}
                dValue={<DateTime dateTime={updated_at} />}
              />
            </DescriptionList>

            <Heading level={(headinglevel + 1) as IHeadingLevel}>
              {t((t) => t.place["Tasks"])}
            </Heading>
            <TasksStats language={language} placeID={place.id} />
          </OverviewBody>

          <OverviewFooter>
            <List>
              <ListItem>
                <LinkButton href={createPlaceEditPageURL(language, id)}>
                  {t((t) => t.place["Edit"])}
                </LinkButton>
              </ListItem>
            </List>
          </OverviewFooter>
        </>
      )}
    </Overview>
  );
}
