"use client";

import { useEffect, useState } from "react";
import { Details, DetailsBody, DetailsHeader } from "#components/details";
import { type ITranslatableProps } from "#components/types";
import type { ILocalizationPage } from "#lib/localization";
import { URLViewer } from "./viewer";

interface IProps extends ITranslatableProps {
  translation: ILocalizationPage["url-viewer"];
}

export function Client({ commonTranslation, translation }: IProps) {
  const [currentURL, changeCurrentURL] = useState<URL>();

  useEffect(() => {
    changeCurrentURL(new URL(location.href))
  }, [])

  return (
    <Details headingLevel={2}>
      {() => (
        <>
          <DetailsHeader></DetailsHeader>

          <DetailsBody>
            {!currentURL ? (
              translation["No URL selected."]
            ) : (
              <URLViewer translation={translation} url={currentURL} />
            )}
          </DetailsBody>
        </>
      )}
    </Details>
  );
}
