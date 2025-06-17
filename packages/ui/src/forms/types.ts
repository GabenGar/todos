export interface IFormData<Field extends string = string> extends FormData {
  get(name: Field): FormDataEntryValue | null;
  getAll(name: Field): FormDataEntryValue[];
}
