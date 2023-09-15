import { validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { logError } from "#lib/logs";
import { initSchemas } from "./init";
import { schemaMap, toRetrievalURL } from "./map";

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
    const result = validatorFunc(data, BASIC);

    if (!result.valid) {
      logError(result);
      throw new Error(`Data does not conform to schema "${schemaID}".`);
    }
  }

  return validator;
}
