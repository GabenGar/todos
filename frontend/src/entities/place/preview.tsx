import { ILocalization } from "#lib/localization";
import { DescriptionList } from "#components";
import { EntityID } from "#components/entities";
import { Heading } from "#components/heading";
import { createBlockComponent } from "#components/meta";
import {
  type IPreviewProps,
  Preview,
  PreviewBody,
  PreviewHeader,
} from "#components/preview";
import { DateTime } from "#components/date";
import type { IPlace } from "./types";

interface IProps extends IPreviewProps {
  translation: ILocalization["place"];
  place: IPlace;
}

export const PlacePreview = createBlockComponent(undefined, Component);

function Component({ translation, place, ...props }: IProps) {
  const { id, title, description, created_at, updated_at } = place;

  return (
    <Preview {...props}>
      {(headingLevel) => (
        <>
          <PreviewHeader>
            <Heading level={headingLevel}>{title}</Heading>
            <EntityID>{id}</EntityID>
          </PreviewHeader>

          <PreviewBody>
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
                  <DateTime key={"created_at"} dateTime={created_at} />,
                ],
                [
                  translation.updated_at,
                  <DateTime key={"updated_at"} dateTime={updated_at} />,
                ],
              ]}
            />
          </PreviewBody>
        </>
      )}
    </Preview>
  );
}
