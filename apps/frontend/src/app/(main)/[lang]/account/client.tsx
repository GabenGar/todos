"use client";

import { useRouter } from "next/navigation";
import type { ILocalization, ILocalizationPage } from "#lib/localization";
import { useClient } from "#hooks";
import type { ITranslatableProps } from "#components/types";
import { Details, DetailsBody, DetailsHeader } from "#components/overview";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { Heading } from "#components/heading";
import { Link } from "#components/link";
import { Pre } from "#components/pre";
import { DataExportForm, ImportDataExportForm } from "#entities/data-export";
import { SettingsForm } from "./settings-form";

interface IProps extends ITranslatableProps {
  translation: ILocalizationPage["account"];
}

export function Client({ commonTranslation, translation }: IProps) {
  const router = useRouter();
  const clientInfo = useClient();

  return (
    <>
      <Details headingLevel={2}>
        {(headingLevel) => (
          <>
            <DetailsHeader>
              <Heading
                // @ts-expect-error type widening
                level={headingLevel + 1}
              >
                {translation["Data"]}
              </Heading>
            </DetailsHeader>

            <DetailsBody>
              <Heading
                // @ts-expect-error type widening
                level={headingLevel + 2}
              >
                {translation["Export"]}
              </Heading>
              <DataExportForm translation={translation} />

              <Heading
                // @ts-expect-error type widening
                level={headingLevel + 2}
              >
                {translation["Import"]}
              </Heading>
              <ImportDataExportForm
                commonTranslation={commonTranslation}
                translation={translation}
                id="import-data-export"
                onSuccess={async () => router.refresh()}
              />
            </DetailsBody>
          </>
        )}
      </Details>

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
              <Compatibility translation={translation} />
            </DetailsBody>
          </>
        )}
      </Details>

      <Details headingLevel={2}>
        {(headingLevel) => (
          <>
            <DetailsHeader>
              <Heading
                // @ts-expect-error type widening
                level={headingLevel + 1}
              >
                {translation["Settings"]}
              </Heading>
            </DetailsHeader>
            <DetailsBody>
              {!clientInfo.isClient ? (
                <Loading />
              ) : (
                <SettingsForm
                  key={clientInfo.logLevel}
                  commonTranslation={commonTranslation}
                  translation={translation}
                  id="edit-account-settings"
                  currentLogLevel={clientInfo.logLevel}
                  onSettingsUpdate={async (settingsUpdate) => {
                    clientInfo.changeLoglevel(settingsUpdate.log_level);
                  }}
                />
              )}
            </DetailsBody>
          </>
        )}
      </Details>
    </>
  );
}

interface ICompatibilityProps extends Pick<IProps, "translation"> {}

function Compatibility({ translation }: ICompatibilityProps) {
  const clientInfo = useClient();

  return (
    <DescriptionList>
      <DescriptionSection
        isHorizontal
        dKey={
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">
            <Pre>localStorage</Pre>
          </Link>
        }
        dValue={
          !clientInfo.isClient ? (
            <Loading />
          ) : clientInfo.compatibility ? (
            translation["Supported"]
          ) : (
            translation["Not supported"]
          )
        }
      />
    </DescriptionList>
  );
}
