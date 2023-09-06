import { addSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import dataExportSchema from "#schema/entities/data-export.schema.json";
import taskSchema from "#schema/entities/task.schema.json";
import nanoidSchema from "#schema/strings/nanoid.schema.json";
import dateTimeSchema from "#schema/dates/datetime.schema.json";

init();

async function init() {
  addSchema(dataExportSchema);
  addSchema(taskSchema);
  addSchema(nanoidSchema);
  addSchema(dateTimeSchema);
}

export async function createValidator<InputType>(schemaID: string): Promise<
  (data: unknown) => data is InputType
> {
  const validatorFunc = await validate(schemaID)

  function validator(data: unknown): data is InputType {
    const result = validatorFunc(data)

    if (!result.valid) {
      throw new Error(`Data does not conform to schema "${schemaID}".`)
    }

    return result.valid
  }

  return validator;
}
