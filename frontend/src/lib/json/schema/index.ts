import { addSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
// @ts-expect-error type def problem
import { BASIC } from "@hyperjump/json-schema/experimental";
import dataExportSchema from "#schema/entities/data-export.schema.json";
import taskSchema from "#schema/entities/task.schema.json";
import nanoidSchema from "#schema/strings/nanoid.schema.json";
import dateTimeSchema from "#schema/dates/datetime.schema.json";

init();

async function init() {
  addSchema(
    dataExportSchema,
    toSchemaID(dataExportSchema.$id),
    "https://json-schema.org/draft/2020-12/schema",
  );
  addSchema(
    taskSchema,
    toSchemaID(taskSchema.$id),
    "https://json-schema.org/draft/2020-12/schema",
  );
  addSchema(
    nanoidSchema,
    toSchemaID(nanoidSchema.$id),
    "https://json-schema.org/draft/2020-12/schema",
  );
  addSchema(
    dateTimeSchema,
    toSchemaID(dateTimeSchema.$id),
    "https://json-schema.org/draft/2020-12/schema",
  );
}

/**
 * @TODO remove direct origin ref
 */
function toSchemaID(id: string) {
  if (!id.startsWith("/")) {
    throw new Error(`Schema "${id}" doesn't start with "/".`);
  }

  return `https://gabengar.vercel.app/schema${id}`;
}

export async function createValidator<InputType>(
  schemaID: string,
): Promise<(data: unknown) => data is InputType> {
  const validatorFunc = await validate(toSchemaID(schemaID));

  function validator(data: unknown): data is InputType {
    const result = validatorFunc(data, BASIC);

    if (!result.valid) {
      console.error(result);
      throw new Error(`Data does not conform to schema "${schemaID}".`);
    }

    return result.valid;
  }

  return validator;
}
