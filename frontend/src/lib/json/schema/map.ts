import type { SchemaObject } from "@hyperjump/json-schema/schema/experimental";
import {
  dataExportSchema,
  dateTimeSchema,
  nanoidSchema,
  taskInitSchema,
  taskSchema,
  taskStatusSchema,
  taskUpdateSchema,
} from "./types";
import { SITE_ORIGIN } from "#environment";

export const schemaMap = new Map<string, SchemaObject>([
  [toRetrievalURL(dataExportSchema.$id), dataExportSchema],
  [toRetrievalURL(taskSchema.$id), taskSchema],
  [toRetrievalURL(taskInitSchema.$id), taskInitSchema],
  [toRetrievalURL(taskStatusSchema.$id), taskStatusSchema],
  [toRetrievalURL(taskUpdateSchema.$id), taskUpdateSchema],
  [toRetrievalURL(nanoidSchema.$id), nanoidSchema],
  [toRetrievalURL(dateTimeSchema.$id), dateTimeSchema],
]);

export type ISchemaMap = typeof schemaMap;

export function toRetrievalURL(id: string) {
  if (!id.startsWith("/")) {
    throw new Error(`Schema ID "${id}" doesn't start with "/".`);
  }

  return `${SITE_ORIGIN}${id}`;
}
