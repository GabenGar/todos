"use client";

import { useClient } from "#hooks";
import type { ITranslatableProps } from "#components/types";
import { Details, DetailsHeader } from "#components/details";
import { Loading } from "#components";

interface IProps extends ITranslatableProps {}

export function Client({ commonTranslation }: IProps) {
  const { isClient } = useClient();

  return !isClient ? (
    <Details headingLevel={2}>
      {(headingLevel) => (
        <DetailsHeader>
          <Loading />
        </DetailsHeader>
      )}
    </Details>
  ) : (
    <Details headingLevel={2}>
      {(headingLevel) => <DetailsHeader>{isClient}Client</DetailsHeader>}
    </Details>
  );
}
