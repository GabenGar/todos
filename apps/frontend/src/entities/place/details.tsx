import type { ILocalization } from "#lib/localization";
import { createPlaceEditPageURL } from "#lib/urls";
import { createBlockComponent } from "#components/meta";
import { DescriptionList, DescriptionSection } from "#components";
import { ITranslatableProps, type ILocalizableProps } from "#components/types";
import { Heading, type IHeadingLevel } from "#components/heading";
import { DateTime } from "#components/date";
import {
  Details,
  DetailsBody,
  DetailsFooter,
  DetailsHeader,
  type IDetailsProps,
} from "#components/details";
import { EntityDescription, EntityID } from "#components/entities";
import { LinkButton } from "#components/link";
import { List, ListItem } from "#components/list";
import { TasksStats } from "#entities/task";
import type { IPlace } from "./types";

import styles from "./details.module.scss";

export interface IPlaceDetailsProps
  extends IDetailsProps,
    ILocalizableProps,
    ITranslatableProps {
  translation: ILocalization["place"];
  taskTranslation: ILocalization["stats_tasks"];
  place: IPlace;
}

export const PlaceDetails = createBlockComponent(styles, Component);

function Component({
  language,
  commonTranslation,
  translation,
  taskTranslation,
  place,
  ...props
}: IPlaceDetailsProps) {
  const { id, title, description, created_at, updated_at } = place;

  return (
    <Details {...props}>
      {(headinglevel) => (
        <>
          <DetailsHeader>
            <Heading level={headinglevel}>{title}</Heading>
            <EntityID
              className={styles.id}
              commonTranslation={commonTranslation}
              entityID={id}
            />
          </DetailsHeader>

          <DetailsBody>
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
          </DetailsBody>

          <DetailsFooter>
            <List>
              <ListItem>
                <LinkButton href={createPlaceEditPageURL(language, id)}>
                  {translation["Edit"]}
                </LinkButton>
              </ListItem>
            </List>
          </DetailsFooter>
        </>
      )}
    </Details>
  );
}
