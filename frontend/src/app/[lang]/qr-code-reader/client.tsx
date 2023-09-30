"use client";

import { useState } from "react";
import type { ILocalization } from "#lib/localization";
import { DescriptionList, DescriptionSection } from "#components";
import { Details, DetailsBody, DetailsHeader } from "#components/details";
import type { ITranslatableProps } from "#components/types";
import { QRCodeReaderForm } from "./form";

interface IProps extends ITranslatableProps {
  translation: ILocalization["pages"]["qr_code_reader"];
}

export function Client({ commonTranslation, translation }: IProps) {
  const [content, changeContent] = useState<string>();

  return (
    <Details headingLevel={2}>
      {() => (
        <>
          <DetailsHeader>
            <QRCodeReaderForm
              commonTranslation={commonTranslation}
              translation={translation}
              id="qr-code-reader"
              onSuccessfulScan={async (result) => changeContent(result)}
            />
          </DetailsHeader>

          <DetailsBody>
            <DescriptionList>
              <DescriptionSection dKey={translation.result} dValue={content ?? translation.no_result} />
            </DescriptionList>
          </DetailsBody>
        </>
      )}
    </Details>
  );
}
