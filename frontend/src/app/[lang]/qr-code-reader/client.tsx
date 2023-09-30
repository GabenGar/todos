"use client";

import type { ILocalization } from "#lib/localization";
import { Details, DetailsBody, DetailsHeader } from "#components/details";
import type { ITranslatableProps } from "#components/types";
import { QRCodeReaderForm } from "./form";

interface IProps extends ITranslatableProps {
  translation: ILocalization["pages"]["qr_code_reader"];
}

export function Client({ commonTranslation, translation }: IProps) {
  return (
    <Details headingLevel={2}>
      {() => (
        <>
          <DetailsHeader>
            <QRCodeReaderForm
              commonTranslation={commonTranslation}
              translation={translation}
              id="qr-code-reader"
            />
          </DetailsHeader>
          <DetailsBody></DetailsBody>
        </>
      )}
    </Details>
  );
}
