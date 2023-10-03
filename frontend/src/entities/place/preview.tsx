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
import type { IPlace } from "./types";

interface IProps extends IPreviewProps {
  place: IPlace;
}

export const PlacePreview = createBlockComponent(undefined, Component);

function Component({ place, ...props }: IProps) {
  const { id, title, description } = place;

  return (
    <Preview {...props}>
      {(headingLevel) => (
        <>
          <PreviewHeader>
            <Heading level={headingLevel}>{title}</Heading>
            <EntityID>{id}</EntityID>
          </PreviewHeader>

          <PreviewBody>
            <DescriptionList></DescriptionList>
          </PreviewBody>
        </>
      )}
    </Preview>
  );
}
