import type { ILocalization } from "#lib/localization";
import { createPlaceEditPageURL } from "#lib/urls";
import { createBlockComponent } from "#components/meta";
import { DescriptionList, DescriptionSection } from "#components";
import { ITranslatableProps } from "#components/types";
import { Heading, type IHeadingLevel } from "#components/heading";
import { DateTime } from "#components/date";
import {
  Details,
  DetailsBody,
  DetailsFooter,
  DetailsHeader,
  type IDetailsProps,
} from "#components/details";
import { EntityID } from "#components/entities";
import { LinkButton } from "#components/link";
import { TasksStats } from "#entities/task";
import type { IPlace } from "./types";

export interface IPlaceDetailsProps extends IDetailsProps, ITranslatableProps {
  translation: ILocalization["place"];
  taskTranslation: ILocalization["stats_tasks"];
  place: IPlace;
}

import styles from "./details.module.scss";

export const PlaceDetails = createBlockComponent(styles, Component);

function Component({
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
                dValue={description ?? translation.no_description}
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
              commonTranslation={commonTranslation}
              translation={taskTranslation}
              placeID={place.id}
            />
          </DetailsBody>

          <DetailsFooter>
            <ul>
              <li>
                <LinkButton href={createPlaceEditPageURL(id)}>
                  {translation["Edit"]}
                </LinkButton>
              </li>
            </ul>
          </DetailsFooter>
        </>
      )}
    </Details>
  );
}
