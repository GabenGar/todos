"use client";

import { useRouter } from "next/navigation";
import type { ILocalizationPage } from "#lib/localization";
import { useClient } from "#hooks";
import type { ITranslatableProps } from "#components/types";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
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
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading
                // @ts-expect-error type widening
                level={headingLevel + 1}
              >
                {translation["Data"]}
              </Heading>
            </OverviewHeader>

            <OverviewBody>
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
            </OverviewBody>
          </>
        )}
      </Overview>

      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading
                // @ts-expect-error type widening
                level={headingLevel + 1}
              >
                {translation["Compatibility"]}
              </Heading>
            </OverviewHeader>
            <OverviewBody>
              <Compatibility translation={translation} />
            </OverviewBody>
          </>
        )}
      </Overview>

      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading
                // @ts-expect-error type widening
                level={headingLevel + 1}
              >
                {translation["Settings"]}
              </Heading>
            </OverviewHeader>
            <OverviewBody>
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
            </OverviewBody>
          </>
        )}
      </Overview>
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
