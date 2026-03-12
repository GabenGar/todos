import { Form, type IFormEvent } from "#components/form";
import { InputSectionFile } from "#components/form/section";
import { usePageTranslation } from "#hooks";
import { fromJSON } from "#lib/json";
import { importDataExport } from "./lib";
//

import styles from "./import-form.module.scss";

export interface IImportDataExportFormProps {
  id: string;
  onSuccess?: () => Promise<void>;
}

export function ImportDataExportForm({
  id,
  onSuccess,
}: IImportDataExportFormProps) {
  const { t } = usePageTranslation("page-account");
  const FIELD = {
    FILE: { name: "file", label: t((t) => t["Click to upload a file"]) },
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
      id={id}
      className={styles.block}
      submitButton={(_formID, isSubmitting) =>
        t((t) => (!isSubmitting ? t["Import data"] : t["Importing data..."]))
      }
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
