"use client";

import { useEffect } from "react";
import { ILocalizationPage } from "#lib/localization";
import { useClient } from "#hooks";
import type { ITranslatableProps } from "#components/types";
import { Details, DetailsBody, DetailsHeader } from "#components/details";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { Heading } from "#components/heading";
import { Link } from "#components/link";
import { Pre } from "#components/pre";

interface IProps extends ITranslatableProps {
  translation: ILocalizationPage["account"];
}

export function Client({ commonTranslation, translation }: IProps) {
  const clientInfo = useClient();

  if (!clientInfo.isClient) {
    return (
      <Details headingLevel={2}>
        {(headingLevel) => (
          <>
            <DetailsHeader>
              <Heading
                // @ts-expect-error type widening
                level={headingLevel + 1}
              >
                {translation["Compatibility"]}
              </Heading>
            </DetailsHeader>

            <DetailsBody>
              <DescriptionList>
                <DescriptionSection
                  isHorizontal
                  dKey={
                    <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">
                      <Pre>localeStorage</Pre>
                    </Link>
                  }
                  dValue={<Loading />}
                />
              </DescriptionList>
            </DetailsBody>
          </>
        )}
      </Details>
    );
  }

  const { compatibility } = clientInfo;

  return (
    <Details headingLevel={2}>
      {(headingLevel) => (
        <>
          <DetailsHeader>
            <Heading
              // @ts-expect-error type widening
              level={headingLevel + 1}
            >
              {translation["Compatibility"]}
            </Heading>
          </DetailsHeader>

          <DetailsBody>
            <DescriptionList>
              <DescriptionSection
                isHorizontal
                dKey={
                  <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">
                    <Pre>localeStorage</Pre>
                  </Link>
                }
                dValue={
                  compatibility
                    ? translation["Supported"]
                    : translation["Not supported"]
                }
              />
            </DescriptionList>
          </DetailsBody>
        </>
      )}
    </Details>
  );
}
