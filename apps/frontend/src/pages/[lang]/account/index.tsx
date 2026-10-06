import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { List, ListItem } from "@repo/ui/lists";
import { Loading } from "@repo/ui/loading";
import { Page } from "#components";
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
import type { IPageNamespace } from "#translation";
//

import styles from "./index.module.scss";

const namespace = "page-account" satisfies IPageNamespace;

function AccountPage() {
  const { t } = usePageTranslation(namespace);
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
                {t((t) => t["feature-support"].heading)}
              </Heading>
            </OverviewHeader>
            <OverviewBody>
              <FeatureSupport />
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
  const { t } = usePageTranslation(namespace);
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
  const { t } = usePageTranslation(namespace);
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

interface IFeatureSupport {
  calendar: string[];
  collation: string[];
  currency: string[];
  numberingSystem: string[];
  timeZone: string[];
  unit: string[];
}

function FeatureSupport() {
  const client = useClient();
  const { t } = usePageTranslation("page-account");
  const [featureSupport, changeFeatureSupport] = useState<IFeatureSupport>();

  useEffect(() => {
    if (!client) {
      return;
    }

    const nextFeatureSupport = collectFeatureSupport();

    changeFeatureSupport(nextFeatureSupport);
  }, [client]);

  return !featureSupport ? (
    <Loading />
  ) : (
    <DescriptionList>
      <DescriptionSection
        dKey={t((t) => t["feature-support"].calendars)}
        dValue={
          <Details
            summary={
              <Preformatted>{featureSupport.calendar.length}</Preformatted>
            }
          >
            <List>
              {featureSupport.calendar.map((calendar, index) => (
                <ListItem key={`${calendar}${index}`}>
                  <Preformatted>{calendar}</Preformatted>
                </ListItem>
              ))}
            </List>
          </Details>
        }
      />

      <DescriptionSection
        dKey={t((t) => t["feature-support"].collations)}
        dValue={
          <Details
            summary={
              <Preformatted>{featureSupport.collation.length}</Preformatted>
            }
          >
            <List>
              {featureSupport.collation.map((collation, index) => (
                <ListItem key={`${collation}${index}`}>
                  <Preformatted>{collation}</Preformatted>
                </ListItem>
              ))}
            </List>
          </Details>
        }
      />

      <DescriptionSection
        dKey={t((t) => t["feature-support"].currencies)}
        dValue={
          <Details
            summary={
              <Preformatted>{featureSupport.currency.length}</Preformatted>
            }
          >
            <List>
              {featureSupport.currency.map((currency, index) => (
                <ListItem key={`${currency}${index}`}>
                  <Preformatted>{currency}</Preformatted>
                </ListItem>
              ))}
            </List>
          </Details>
        }
      />

      <DescriptionSection
        dKey={t((t) => t["feature-support"]["numbering-systems"])}
        dValue={
          <Details
            summary={
              <Preformatted>
                {featureSupport.numberingSystem.length}
              </Preformatted>
            }
          >
            <List>
              {featureSupport.numberingSystem.map((system, index) => (
                <ListItem key={`${system}${index}`}>
                  <Preformatted>{system}</Preformatted>
                </ListItem>
              ))}
            </List>
          </Details>
        }
      />

      <DescriptionSection
        dKey={t((t) => t["feature-support"]["time-zones"])}
        dValue={
          <Details
            summary={
              <Preformatted>{featureSupport.timeZone.length}</Preformatted>
            }
          >
            <List>
              {featureSupport.timeZone.map((zone, index) => (
                <ListItem key={`${zone}${index}`}>
                  <Preformatted>{zone}</Preformatted>
                </ListItem>
              ))}
            </List>
          </Details>
        }
      />

      <DescriptionSection
        dKey={t((t) => t["feature-support"].units)}
        dValue={
          <Details
            summary={<Preformatted>{featureSupport.unit.length}</Preformatted>}
          >
            <List>
              {featureSupport.unit.map((unit, index) => (
                <ListItem key={`${unit}${index}`}>
                  <Preformatted>{unit}</Preformatted>
                </ListItem>
              ))}
            </List>
          </Details>
        }
      />
    </DescriptionList>
  );
}

function collectFeatureSupport(): IFeatureSupport {
  const calendar = Intl.supportedValuesOf("calendar");
  const collation = Intl.supportedValuesOf("collation");
  const currency = Intl.supportedValuesOf("currency");
  const numberingSystem = Intl.supportedValuesOf("numberingSystem");
  const timeZone = Intl.supportedValuesOf("timeZone");
  const unit = Intl.supportedValuesOf("unit");

  const featureSupport = {
    calendar,
    collation,
    currency,
    numberingSystem,
    timeZone,
    unit,
  } satisfies IFeatureSupport;

  return featureSupport;
}

export const getStaticProps = createGetStaticProps(namespace);

export const getStaticPaths = getStaticExportPaths;

export default AccountPage;
