import type { ILocalization } from "#lib/localization";
import { createPlaceEditPageURL } from "#lib/urls";
import { createBlockComponent } from "#components/meta";
import { DescriptionList, DescriptionSection } from "#components";
import { ITranslatableProps, type ILocalizableProps } from "#components/types";
import { Heading, type IHeadingLevel } from "#components/heading";
import { DateTime } from "#components/date";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
  type IOverviewProps,
} from "#components/overview";
import { EntityDescription, EntityID } from "#components/entities";
import { LinkButton } from "#components/link";
import { List, ListItem } from "#components/list";
import { TasksStats } from "#entities/task";
import type { IPlace } from "./types";

import styles from "./details.module.scss";

export interface IPlaceOverviewProps
  extends IOverviewProps,
    ILocalizableProps,
    ITranslatableProps {
  translation: ILocalization["place"];
  taskTranslation: ILocalization["stats_tasks"];
  place: IPlace;
}

export const PlaceOverview = createBlockComponent(styles, Component);

function Component({
  language,
  commonTranslation,
  translation,
  taskTranslation,
  place,
  ...props
}: IPlaceOverviewProps) {
  const { id, title, description, created_at, updated_at } = place;

  return (
    <Overview {...props}>
      {(headinglevel) => (
        <>
          <OverviewHeader>
            <Heading level={headinglevel}>{title}</Heading>
            <EntityID
              className={styles.id}
              commonTranslation={commonTranslation}
              entityID={id}
            />
          </OverviewHeader>

          <OverviewBody>
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

            <DescriptionList>
              <DescriptionSection
                dKey={translation.created_at}
                dValue={
                  <DateTime
                    commonTranslation={commonTranslation}
                    dateTime={created_at}
                  />
                }
              />
              <DescriptionSection
                dKey={translation.updated_at}
                dValue={
                  <DateTime
                    commonTranslation={commonTranslation}
                    dateTime={updated_at}
                  />
                }
              />
            </DescriptionList>

            <Heading level={(headinglevel + 1) as IHeadingLevel}>
              {translation["Tasks"]}
            </Heading>
            <TasksStats
              language={language}
              commonTranslation={commonTranslation}
              translation={taskTranslation}
              placeID={place.id}
            />
          </OverviewBody>

          <OverviewFooter>
            <List>
              <ListItem>
                <LinkButton href={createPlaceEditPageURL(language, id)}>
                  {translation["Edit"]}
                </LinkButton>
              </ListItem>
            </List>
          </OverviewFooter>
        </>
      )}
    </Overview>
  );
}
