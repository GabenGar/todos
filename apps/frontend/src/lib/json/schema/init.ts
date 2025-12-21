import AJV2020, { type AnySchema } from "ajv/dist/2020";
import { schemas, type IValidSchemaID } from "./map";

interface ISchemaMap extends Record<IValidSchemaID, AnySchema> {}

export const ajv = createAJV();

function createAJV() {
  const schemaMap = schemas.reduce<ISchemaMap>((schemaMap, schema) => {
    schemaMap[schema.$id] = schema as AnySchema;

    return schemaMap;
  }, {} as ISchemaMap);

  // there are duplicate IDs
  if (Object.keys(schemaMap).length !== schemas.length) {
    const duplicateKeys = Object.entries(
      schemas.reduce<Record<IValidSchemaID, number>>(
        (keyMap, { $id }) => {
          const currentCount = keyMap[$id];

          if (!currentCount) {
            keyMap[$id] = 1;
          } else {
            keyMap[$id] = currentCount + 1;
          }

          return keyMap;
        },
        {} as Record<IValidSchemaID, number>,
      ),
    )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([id, count]) => count > 1)
      .map<string>(([id]) => `"${id}"`)
      .join(", ");

    throw new Error(`Duplicated schema IDs: ${duplicateKeys}.`);
  }

  const ajv = new AJV2020({ schemas: schemaMap });

  return ajv;
}
