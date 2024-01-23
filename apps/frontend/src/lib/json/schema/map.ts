import { schema as entityItemSchema } from "#json-schema/entities/item";
import { schema as dataExportSchema } from "#json-schema/entities/data-export";
import { schema as taskSchema } from "#json-schema/entities/task/entity";
import { schema as taskStatusSchema } from "#json-schema/entities/task/status";
import { schema as taskInitSchema } from "#json-schema/entities/task/init";
import { schema as taskUpdateSchema } from "#json-schema/entities/task/update";
import { schema as taskStatsAllSchema } from "#json-schema/entities/task/stats";
import { schema as placeSchema } from "#json-schema/entities/place/entity";
import { schema as placeInitSchema } from "#json-schema/entities/place/init";
import { schema as placeUpdateSchema } from "#json-schema/entities/place/update";
import { schema as nonNegativeIntegerSchema } from "#json-schema/numbers/non-negative-integer";
import { schema as positiveIntegerSchema } from "#json-schema/numbers/positive-integer";
import { schema as nanoidSchema } from "#json-schema/strings/nanoid";
import { schema as titleSchema } from "#json-schema/strings/title";
import { schema as descriptionSchema } from "#json-schema/strings/description";
import { schema as dateTimeSchema } from "#json-schema/dates/datetime";

export const schemas = [
  dataExportSchema,
  taskSchema,
  taskInitSchema,
  taskStatusSchema,
  taskUpdateSchema,
  nanoidSchema,
  dateTimeSchema,
  nonNegativeIntegerSchema,
  positiveIntegerSchema,
  taskStatsAllSchema,
  titleSchema,
  descriptionSchema,
  placeInitSchema,
  placeSchema,
  placeUpdateSchema,
  entityItemSchema,
] as const;
const validIDs = schemas.map((schema) => schema.$id);

export type IValidSchemaID = (typeof validIDs)[number];

export function isValidSchemaID(input: unknown): input is IValidSchemaID {
  return validIDs.includes(input as IValidSchemaID);
}

export function validateSchemaID(
  input: unknown,
): asserts input is IValidSchemaID {
  if (!isValidSchemaID(input)) {
    throw new Error(`Unknown schema ID "${input}".`);
  }
}
