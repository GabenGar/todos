import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { getDictionary } from "#lib/localization";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";
import { getStaticExportPaths } from "#server";
import { useClient } from "#hooks";
import { Page } from "#components";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { Heading } from "#components/heading";
import { Link } from "#components/link";
import { Pre } from "#components/pre";
import { DataExportForm, ImportDataExportForm } from "#entities/data-export";
import { SettingsForm } from "./settings-form";

interface IProps extends ILocalizedProps<"account"> {}

interface IParams extends ILocalizedParams {}

function AccountPage({
  translation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const client = useClient();
  const { common, t } = translation;

  return (
    <Page heading={t.heading} title={t.title}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading level={headingLevel + 1}>{t["Data"]}</Heading>
            </OverviewHeader>

            <OverviewBody>
              <Heading level={headingLevel + 2}>{t["Export"]}</Heading>
              <DataExportForm translation={t} />

              <Heading level={headingLevel + 2}>{t["Import"]}</Heading>
              <ImportDataExportForm
                commonTranslation={common}
                translation={t}
                id="import-data-export"
                onSuccess={async () => router.reload()}
              />
            </OverviewBody>
          </>
        )}
      </Overview>

      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading level={headingLevel + 1}>{t["Compatibility"]}</Heading>
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
              <Heading level={headingLevel + 1}>{t["Settings"]}</Heading>
            </OverviewHeader>
            <OverviewBody>
              {!client ? (
                <Loading />
              ) : (
                <SettingsForm
                  key={client.logLevel}
                  commonTranslation={common}
                  translation={t}
                  id="edit-account-settings"
                  currentLogLevel={client.logLevel}
                  onSettingsUpdate={async (settingsUpdate) => {
                    client.changeLoglevel(settingsUpdate.log_level);
                  }}
                />
              )}
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

interface ICompatibilityProps extends Pick<IProps, "translation"> {}

/**
 * @TODO colouring
 */
function Compatibility({ translation }: ICompatibilityProps) {
  const client = useClient();
  const { t } = translation;

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
          !client ? (
            <Loading />
          ) : client.compatibility.localStorage ? (
            t["Supported"]
          ) : (
            t["Not supported"]
          )
        }
      />

      <DescriptionSection
        isHorizontal
        dKey={
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API">
            <Pre>IndexedDB</Pre>
          </Link>
        }
        dValue={
          !client ? (
            <Loading />
          ) : client.compatibility.indexedDB ? (
            t["Supported"]
          ) : (
            t["Not supported"]
          )
        }
      />
    </DescriptionList>
  );
}

export const getStaticProps: GetStaticProps<IProps, IParams> = async ({
  params,
}) => {
  const { lang } = params!;
  const dict = await getDictionary(lang);
  const { account } = dict.pages;
  const props = {
    translation: { lang, common: dict.common, t: account },
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default AccountPage;
