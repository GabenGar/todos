import { addSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import type { SchemaObject } from "@hyperjump/json-schema/schema/experimental";
import dataExportSchema from "#schema/entities/data-export.schema.json";
import taskSchema from "#schema/entities/task.schema.json";
import taskStatusSchema from "#schema/entities/task-status.schema.json";
import nanoidSchema from "#schema/strings/nanoid.schema.json";
import dateTimeSchema from "#schema/dates/datetime.schema.json";
import { logDebug, logError } from "#lib/logs";

const metaSchema = "https://json-schema.org/draft/2020-12/schema";

init(metaSchema, [
  dataExportSchema,
  taskSchema,
  taskStatusSchema,
  nanoidSchema,
  dateTimeSchema,
]);

async function init(
  metaSchema: string,
  schemas: (SchemaObject & { $id: string })[],
) {
  logDebug(
    `Loading ${schemas.length} schemas with metaschema "${metaSchema}"...`,
  );

  const addedIDs = schemas.map<ReturnType<typeof addSchema>>((schema) => {
    const id = addSchema(schema, toSchemaID(schema.$id), metaSchema);

    return id;
  });

  logDebug(`Loaded ${addedIDs.length} schemas with metaschema "${metaSchema}".`);
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
): Promise<(data: unknown) => asserts data is InputType> {
  const validatorFunc = await validate(toSchemaID(schemaID));

  function validator(data: unknown): asserts data is InputType {
    const result = validatorFunc(data, BASIC);

    if (!result.valid) {
      logError(result);
      throw new Error(`Data does not conform to schema "${schemaID}".`);
    }
  }

  return validator;
}
