import { addSchema } from "@hyperjump/json-schema/draft-2020-12";
import type { SchemaObject } from "@hyperjump/json-schema/schema/experimental";
import { logDebug } from "#lib/logs";

export function initSchemas(metaSchema: string, schemas: SchemaObject[]) {
  logDebug(
    `Loading ${schemas.length} schemas with metaschema "${metaSchema}"...`,
  );

  const addedIDs = schemas.map<ReturnType<typeof addSchema>>((schema) => {
    const id = addSchema(schema, undefined, metaSchema);

    return id;
  });

  logDebug(
    `Loaded ${addedIDs.length} schemas with metaschema "${metaSchema}".`,
  );
}
