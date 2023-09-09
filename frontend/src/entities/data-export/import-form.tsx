import { Form } from "#components/form";
import { InputSectionFile } from "#components/form/section";

const FIELD = {
  FILE: { name: "file", label: "file" },
} as const;
type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

interface IProps {
  id: string;
  onSuccess?: () => Promise<void>;
}

export function ImportDataExportForm({ id, onSuccess }: IProps) {

  return (
    <Form id={id}>
      {(formID) => (
        <>
          <InputSectionFile>{FIELD.FILE.label}</InputSectionFile>
        </>
      )}
    </Form>
  );
}
