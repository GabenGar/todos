"use client";

import { Details, DetailsBody, DetailsHeader } from "#components/details";
import { type ITranslatableProps } from "#components/types";

interface IProps
  extends ITranslatableProps {}

export function Client({ commonTranslation }: IProps) {
  return (
    <Details headingLevel={2}>{() => (<>
      <DetailsHeader>

      </DetailsHeader>

      <DetailsBody>

      </DetailsBody>
    </>)}</Details>
  );
}
