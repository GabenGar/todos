import type { ILocalizationPage } from "#lib/localization";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import type { ITranslatableProps } from "#components/types";
import { validateLogLevel, type ILogLevel } from "#lib/logs";
import { InputSectionSelect } from "#components/form/section";
import { InputOption } from "#components/form/input";

import styles from "./settings-form.module.scss";

interface IProps extends ITranslatableProps, IFormComponentProps {
  translation: ILocalizationPage["account"];
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
  commonTranslation,
  translation,
  id,
  currentLogLevel,
  onSettingsUpdate,
}: IProps) {
  const FIELD = {
    LOG_LEVEL: { name: "log_level", label: translation.logger["Log level"] },
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
      commonTranslation={commonTranslation}
      id={id}
      submitButton={(_, isSubmitting) =>
        isSubmitting ? translation["Updating..."] : translation["Update"]
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
                  {translation.logger.levels[translatedValue]}
                </InputOption>
              ),
            )}
          </InputSectionSelect>
        </>
      )}
    </Form>
  );
}
