import type { SchemaObject } from "@hyperjump/json-schema/schema/experimental";
import {
  dataExportSchema,
  dateTimeSchema,
  nanoidSchema,
  taskInitSchema,
  taskSchema,
  taskStatusSchema,
  taskUpdateSchema,
  nonNegativeIntegerSchema,
  taskStatsAllSchema,
  titleSchema,
  descriptionSchema,
  placeInitSchema,
  placeSchema,
  placeUpdateSchema,
  entityItemSchema,
} from "./types";
import { SITE_ORIGIN } from "#environment";

const schemas = [
  dataExportSchema,
  taskSchema,
  taskInitSchema,
  taskStatusSchema,
  taskUpdateSchema,
  nanoidSchema,
  dateTimeSchema,
  nonNegativeIntegerSchema,
  taskStatsAllSchema,
  titleSchema,
  descriptionSchema,
  placeInitSchema,
  placeSchema,
  placeUpdateSchema,
  entityItemSchema,
].map<[string, SchemaObject]>(
  (schema) => [
    toRetrievalURL(schema.$id),
    // @ts-expect-error const object versus mutable type
    schema
  ]
);

export const schemaMap = new Map(schemas);

export type ISchemaMap = typeof schemaMap;

export function toRetrievalURL(id: string) {
  if (!id.startsWith("/")) {
    throw new Error(`Schema ID "${id}" doesn't start with "/".`);
  }

  return `${SITE_ORIGIN}${id}`;
}
