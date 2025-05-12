import { createJSDoc } from "#codegen";
import { createMultiLineString } from "#strings";
import type { IJSONSchemaObject } from "./types.js";

export function createSymbolJSDoc(
  schema: IJSONSchemaObject,
): string | undefined {
  const deprecated = schema.deprecated;
  const readOnly = schema.readOnly;
  const inputLines = [schema.description?.trim()];
  const examples = schema.examples?.flatMap((example) => [
    "@example",
    "```json",
    JSON.stringify(example, undefined, 2),
    "```",
  ]);
  const defaultValue =
    schema.default === undefined
      ? undefined
      : createMultiLineString(
          "@default",
          "```json",
          JSON.stringify(schema.default, undefined, 2),
          "```",
        );

  if (deprecated) {
    inputLines.push("@deprecated");
  }

  if (readOnly) {
    inputLines.push("@readonly");
  }

  if (examples) {
    inputLines.push(...examples);
  }

  if (defaultValue) {
    inputLines.push(defaultValue);
  }

  const jsdocComment = createJSDoc(...inputLines);

  return jsdocComment;
}
