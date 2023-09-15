import { addSchema } from "@hyperjump/json-schema/draft-2020-12";
import { logDebug } from "#lib/logs";
import { ISchemaMap } from "./map";

export function initSchemas(metaSchema: string, schemaMap: ISchemaMap) {
  logDebug(
    `Loading ${schemaMap.size} schemas with metaschema "${metaSchema}"...`,
  );

  const addedIDs = Array.from(schemaMap).map<ReturnType<typeof addSchema>>(
    ([retrievalUri, schema]) => {
      const id = addSchema(schema, retrievalUri, metaSchema);

      return id;
    },
  );

  logDebug(
    `Loaded ${addedIDs.length} schemas with metaschema "${metaSchema}".`,
  );
}
