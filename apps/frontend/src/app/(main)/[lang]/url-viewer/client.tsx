"use client";

import { useState } from "react";
import type { ILocalizationPage } from "#lib/localization";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import { type ITranslatableProps } from "#components/types";
import { URLViewerForm } from "./form";
import { URLViewer } from "./viewer";

interface IProps extends ITranslatableProps {
  translation: ILocalizationPage["url-viewer"];
}

export function Client({ commonTranslation, translation }: IProps) {
  const [currentURL, changeCurrentURL] = useState<URL>();

  return (
    <Overview headingLevel={2}>
      {(headingLevel) => (
        <>
          <OverviewHeader>
            <URLViewerForm
              commonTranslation={commonTranslation}
              translation={translation}
              id="url-viewer"
              onNewURL={async (newURL) => {
                changeCurrentURL(newURL);
              }}
            />
          </OverviewHeader>

          <OverviewBody>
            {!currentURL ? (
              translation["No URL selected."]
            ) : (
              <URLViewer
                translation={translation}
                headingLevel={headingLevel}
                url={currentURL}
              />
            )}
          </OverviewBody>
        </>
      )}
    </Overview>
  );
}
