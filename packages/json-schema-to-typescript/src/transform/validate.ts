import AJV, {
	type ValidateFunction,
	type DefinedError,
} from "ajv/dist/2020.js";
import { createMultiLineString } from "#strings";
import {
	isJSONSchemaTypeString,
	type IJSONSchemaDocument,
	type IJSONSchemaObject,
} from "./types.js";

const ajv = new AJV.default();

const validateSchema: ValidateFunction<unknown> =
	// biome-ignore lint/style/noNonNullAssertion: ajv knows how to validate its own metashema
	ajv.getSchema<unknown>("https://json-schema.org/draft/2020-12/schema")!;

if (!validateSchema) {
	throw new Error(
		`Failed to get validation function for schema "https://json-schema.org/draft/2020-12/schema".`,
	);
}

export function isJSONSchemaObject(input: unknown): input is IJSONSchemaObject {
	if (typeof input === "boolean") {
		return false;
	}

	return validateSchema(input);
}

export function validateJSONSchemaObject(
	input: unknown,
): asserts input is IJSONSchemaObject {
	if (typeof input === "boolean") {
		throw new Error(`Input "${input} is not a valid JSON Schema object.`);
	}

	validateSchema(input);

	if (validateSchema.errors) {
		const messages = (validateSchema.errors as DefinedError[]).map(
			// biome-ignore lint/style/noNonNullAssertion: ajv errors always return messages.
			(error) => error.message!,
		);

		throw new Error(createMultiLineString(...messages));
	}
}

export function isJSONSchemaDocument(input: unknown): input is IJSONSchemaDocument {
	if (!isJSONSchemaObject(input)) {
		return false;
	}

	const isValidSchemaID = Boolean(input.$id && input.$id.trim().length !== 0);
	const isValidTitle = Boolean(input.title && input.title.trim().length !== 0);
	const isValidType = isJSONSchemaTypeString(input.type);
	const isEnum = Boolean(input.enum && input.enum.length !== 0);
	const isConst = Boolean(input.const);
	const isComposite = Boolean(
		(input.allOf && input.allOf.length !== 0) ||
			(input.anyOf && input.anyOf.length !== 0) ||
			(input.oneOf && input.oneOf.length !== 0),
	);
	const isValidShape = isValidType || isEnum || isConst || isComposite;
	const isValid = isValidSchemaID && isValidTitle && isValidShape;

	return isValid;
}

export function validateJSONSchemaDocument(
	input: unknown,
): asserts input is IJSONSchemaDocument {
	validateJSONSchemaObject(input);

	const isValidSchemaID = Boolean(input.$id && input.$id.trim().length !== 0);

	if (!isValidSchemaID) {
		throw new Error(`Schema document must have a non-empty "$id".`);
	}

	const isValidTitle = Boolean(input.title && input.title.trim().length !== 0);

	if (!isValidTitle) {
		throw new Error(`Schema document must have a non-empty "title".`);
	}

	const isValidType = isJSONSchemaTypeString(input.type);
	const isEnum = Boolean(input.enum && input.enum.length !== 0);
	const isConst = Boolean(input.const);
	const isComposite = Boolean(
		(input.allOf && input.allOf.length !== 0) ||
			(input.anyOf && input.anyOf.length !== 0) ||
			(input.oneOf && input.oneOf.length !== 0),
	);

	const isValidShape = isValidType || isEnum || isConst || isComposite;

	if (!isValidShape) {
		throw new Error(
			"Schema document must have a known type or a enum or a const or a composite.",
		);
	}
}
