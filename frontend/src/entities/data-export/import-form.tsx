import { fromJSON } from "#lib/json";
import type { ILocalizationCommon, ILocalization } from "#lib/localization";
import { Form, IFormEvent } from "#components/form";
import { InputSectionFile } from "#components/form/section";
import { ButtonSubmit } from "#components/button";
import { importDataExport } from "./lib";

import styles from "./import-form.module.scss";

interface IProps {
  commonTranslation: ILocalizationCommon;
  translation: ILocalization["todos"];
  id: string;
  onSuccess?: () => Promise<void>;
}

export function ImportDataExportForm({
  commonTranslation,
  translation,
  id,
  onSuccess,
}: IProps) {
  const { click_to_file, import_tasks, importing_tasks } = translation;
  const FIELD = {
    FILE: { name: "file", label: click_to_file },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleImportDataExport(event: IFormEvent<IFieldName>) {
    const filesInput = event.currentTarget.elements.file;
    const files = filesInput.files;

    if (files === null) {
      return;
    }

    const dataExportFile = files.item(0);

    if (dataExportFile === null || dataExportFile.type !== "application/json") {
      return;
    }

    const jsonContent = await dataExportFile.text();
    const dataExport = fromJSON(jsonContent);

    await importDataExport(dataExport);
    await onSuccess?.();
  }

  return (
    <Form<IFieldName>
      commonTranslation={commonTranslation}
      id={id}
      className={styles.block}
      submitButton={(formID, isSubmitting) => (
        <ButtonSubmit viewType="button" form={formID} disabled={isSubmitting}>
          {!isSubmitting ? import_tasks : importing_tasks}
        </ButtonSubmit>
      )}
      onSubmit={handleImportDataExport}
    >
      {(formID) => (
        <>
          <InputSectionFile
            id={`${formID}-${FIELD.FILE.name}`}
            form={formID}
            name={FIELD.FILE.name}
            accept=".json,application/json"
            required
          >
            {FIELD.FILE.label}
          </InputSectionFile>
        </>
      )}
    </Form>
  );
}
