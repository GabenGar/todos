import { validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { DEFAULT_LOG_LEVEL, IS_DEVELOPMENT } from "#environment";
import { logDebug } from "#lib/logs";
import { initSchemas } from "./init";
import { schemaMap, toRetrievalURL } from "./map";
import { toJSONPretty } from "../";

const metaSchema = "https://json-schema.org/draft/2020-12/schema";

let isInitialized = false;

export async function createValidator<InputType>(
  schemaID: string,
): Promise<(data: unknown) => asserts data is InputType> {
  if (!isInitialized) {
    initSchemas(metaSchema, schemaMap);
    isInitialized = true;
  }

  const validatorFunc = await validate(toRetrievalURL(schemaID));

  function validator(data: unknown): asserts data is InputType {
    // log input data during development
    if (IS_DEVELOPMENT && DEFAULT_LOG_LEVEL === "debug") {
      const dataView = Array.isArray(data)
        ? data
        : typeof data === "object"
        ? data !== null
          ? Object.entries(data)
          : data
        : data;
      logDebug(
        `Validating data with schema "${schemaID}":\n${toJSONPretty(dataView)}`,
      );
    }

    const result = validatorFunc(data, BASIC);

    if (!result.valid) {
      throw new Error(
        `Data does not conform to schema "${schemaID}":\n${toJSONPretty(
          result,
        )}`,
      );
    }
  }

  return validator;
}
