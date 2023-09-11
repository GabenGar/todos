import { Form, IFormEvent } from "#components/form";
import { InputSectionFile } from "#components/form/section";
import { fromJSON } from "#lib/json";
import { importDataExport } from "./lib";

import styles from "./import-form.module.scss";
import { ButtonSubmit } from "#components/button";

const FIELD = {
  FILE: { name: "file", label: "Click to import file" },
} as const;
type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

interface IProps {
  id: string;
  onSuccess?: () => Promise<void>;
}

export function ImportDataExportForm({ id, onSuccess }: IProps) {
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
    <Form<IFieldName> id={id} className={styles.block} onSubmit={handleImportDataExport}>
      {(formID) => (
        <>
          <InputSectionFile
            id={`${formID}-${FIELD.FILE.name}`}
            form={formID}
            name={FIELD.FILE.name}
            accept=".json,application/json"
          >
            {FIELD.FILE.label}
          </InputSectionFile>
          <ButtonSubmit form={formID} viewType="button">
            Start import
          </ButtonSubmit>
        </>
      )}
    </Form>
  );
}
