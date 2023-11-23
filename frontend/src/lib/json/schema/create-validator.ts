import { type ValidateFunction, type DefinedError } from "ajv/dist/2020";
import { validateSchemaID, IValidSchemaID } from "./map";
import { ajv } from "./init";

/**
 * @TODO return a type guard and a validator
 */
export function createValidator<InputType>(
  schemaID: IValidSchemaID,
): (data: unknown) => asserts data is InputType {
  validateSchemaID(schemaID);
  let validateFunction: ValidateFunction<InputType>;

  function validate(data: unknown): asserts data is InputType {
    if (!validateFunction) {
      const validator = ajv.getSchema<InputType>(schemaID);

      if (!validator) {
        throw new Error(
          `Failed to find the schema for ID "${schemaID}" despite it being a valid ID.`,
        );
      }

      validateFunction = validator;
    }

    validateFunction(data);

    if (validateFunction.errors) {
      const errors = [...(validateFunction.errors as DefinedError[])];
      const message = errors.map((error) => error.message).join("\n");
      throw new Error(message);
    }
  }

  return validate;
}
