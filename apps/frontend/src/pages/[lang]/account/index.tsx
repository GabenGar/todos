import { useRouter } from "next/router";
import {
  DescriptionList,
  DescriptionSection,
  Loading,
  Page,
} from "#components";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import { InputOption } from "#components/form/input";
import { InputSectionSelect } from "#components/form/section";
import { Heading } from "#components/heading";
import { Link } from "#components/link";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import { Pre } from "#components/pre";
import { DataExportForm, ImportDataExportForm } from "#entities/data-export";
import { useClient, usePageTranslation } from "#hooks";
import { type ILogLevel, validateLogLevel } from "#lib/logs";
import { createGetStaticProps, getStaticExportPaths } from "#server";
//

import styles from "./index.module.scss";

function AccountPage() {
  const { t } = usePageTranslation("page-account");
  const router = useRouter();
  const client = useClient();
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading level={headingLevel + 1}>{t((t) => t["Data"])}</Heading>
            </OverviewHeader>

            <OverviewBody>
              <Heading level={headingLevel + 2}>
                {t((t) => t["Export"])}
              </Heading>
              <DataExportForm />

              <Heading level={headingLevel + 2}>
                {t((t) => t["Import"])}
              </Heading>
              <ImportDataExportForm
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
              <Heading level={headingLevel + 1}>
                {t((t) => t["Compatibility"])}
              </Heading>
            </OverviewHeader>
            <OverviewBody>
              <Compatibility />
            </OverviewBody>
          </>
        )}
      </Overview>

      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <Heading level={headingLevel + 1}>
                {t((t) => t["Settings"])}
              </Heading>
            </OverviewHeader>
            <OverviewBody>
              {!client ? (
                <Loading />
              ) : (
                <SettingsForm
                  key={client.logLevel}
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

/**
 * @TODO colouring
 */
function Compatibility() {
  const { t } = usePageTranslation("page-account");
  const client = useClient();

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
            t((t) => t["Supported"])
          ) : (
            t((t) => t["Not supported"])
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
            t((t) => t["Supported"])
          ) : (
            t((t) => t["Not supported"])
          )
        }
      />
    </DescriptionList>
  );
}

interface ISettingsFormProps extends IFormComponentProps {
  currentLogLevel: ILogLevel;
  onSettingsUpdate: (updatedSettings: ISettingsUpdate) => Promise<void>;
}

interface ISettingsUpdate {
  log_level: ILogLevel;
}

const logLevelTranslation = {
  debug: "Debug",
  log: "Logs",
  info: "Information",
  warn: "Warnings",
  error: "Errors",
} as const;

/**
 * @TODO
 * Find a way to instantiate log level from the user setting on client.
 */
export function SettingsForm({
  id,
  currentLogLevel,
  onSettingsUpdate,
}: ISettingsFormProps) {
  const { t } = usePageTranslation("page-account");
  const FIELD = {
    LOG_LEVEL: { name: "log_level", label: t((t) => t.logger["Log level"]) },
  } as const;

  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const log_level = formElements.log_level.value.trim();

    validateLogLevel(log_level);

    const update: ISettingsUpdate = {
      log_level,
    };

    await onSettingsUpdate(update);
  }

  return (
    <Form<IFieldName>
      id={id}
      submitButton={(_, isSubmitting) =>
        t((t) => (isSubmitting ? t["Updating..."] : t["Update"]))
      }
      onSubmit={handleSubmit}
    >
      {(formID) => (
        <>
          <InputSectionSelect
            label={FIELD.LOG_LEVEL.label}
            id={`${formID}-${FIELD.LOG_LEVEL.name}`}
            form={formID}
            name={FIELD.LOG_LEVEL.name}
            defaultValue={currentLogLevel}
          >
            {Object.entries(logLevelTranslation).map(
              ([value, translatedValue]) => (
                <InputOption
                  key={value}
                  className={styles[value]}
                  value={value}
                >
                  {t((t) => t.logger.levels[translatedValue])}
                </InputOption>
              ),
            )}
          </InputSectionSelect>
        </>
      )}
    </Form>
  );
}

export const getStaticProps = createGetStaticProps("page-account");

export const getStaticPaths = getStaticExportPaths;

export default AccountPage;
