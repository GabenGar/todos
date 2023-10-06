import type { ILocalization } from "#lib/localization";
import { createBlockComponent } from "#components/meta";
import { DescriptionList } from "#components";
import { Heading } from "#components/heading";
import { DateTime } from "#components/date";
import {
  Details,
  DetailsBody,
  DetailsHeader,
  type IDetailsProps,
} from "#components/details";
import { EntityID } from "#components/entities";
import type { IPlace } from "./types";

export interface ITaskDetailsProps extends IDetailsProps {
  translation: ILocalization["place"];
  place: IPlace;
}

export const TaskDetails = createBlockComponent(undefined, Component);

function Component({ translation, place, ...props }: ITaskDetailsProps) {
  const { id, title, description, created_at, updated_at } = place;

  return (
    <Details {...props}>
      {(headinglevel) => (
        <>
          <DetailsHeader>
            <Heading level={headinglevel}>{title}</Heading>
            <EntityID>{id}</EntityID>
          </DetailsHeader>

          <DetailsBody>
            <DescriptionList
              sections={[
                [
                  translation.description,
                  description ?? translation.no_description,
                ],
              ]}
            />
            <DescriptionList
              sections={[
                [
                  translation.created_at,
                  <DateTime key="created_at" dateTime={created_at} />,
                ],
                [
                  translation.updated_at,
                  <DateTime key="updated_at" dateTime={updated_at} />,
                ],
              ]}
            />
          </DetailsBody>
        </>
      )}
    </Details>
  );
}
