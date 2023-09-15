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

export const schemaMap = new Map<string, SchemaObject>([
  [dataExportSchema.$id, dataExportSchema],
  [taskSchema.$id, taskSchema],
  [taskInitSchema.$id, taskInitSchema],
  [taskStatusSchema.$id, taskStatusSchema],
  [taskUpdateSchema.$id, taskUpdateSchema],
  [nanoidSchema.$id, nanoidSchema],
  [dateTimeSchema.$id, dateTimeSchema],
]);

export type ISchemaMap = typeof schemaMap;
