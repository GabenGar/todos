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

const validateSchema: ValidateFunction<IJSONSchemaObject> =
	// biome-ignore lint/style/noNonNullAssertion: ajv knows how to validate its own metashema
	ajv.getSchema<IJSONSchemaObject>(
		"https://json-schema.org/draft/2020-12/schema",
	)!;

if (!validateSchema) {
	throw new Error(
		`Failed to get validation function for schema "https://json-schema.org/draft/2020-12/schema".`,
	);
}

export function isSchemaObject(input: unknown): input is IJSONSchemaObject {
	if (typeof input === "boolean") {
		return false;
	}

	return validateSchema(input);
}

export function validateSchemaObject(
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

export function isSchemaDocument(input: unknown): input is IJSONSchemaDocument {
	if (!isSchemaObject(input)) {
		return false;
	}

	const isValidSchemaID = Boolean(input.$id && input.$id.trim().length !== 0);
	const isValidTitle = Boolean(input.title && input.title.trim().length !== 0);
	const isValidType = isJSONSchemaTypeString(input.type);
	const isEnum = Boolean(input.enum && input.enum.length !== 0);
	const isConst = Boolean(input.const);
	const isComposite =
		("allOf" in input && Array.isArray(input.allOf)) ||
		("anyOf" in input && Array.isArray(input.anyOf)) ||
		("oneOf" in input && Array.isArray(input.oneOf));
	const isValidShape = isValidType || isEnum || isConst || isComposite;
	const isValid = isValidSchemaID && isValidTitle && isValidShape;

	return isValid;
}

export function validateSchemaDocument(
	input: unknown,
): asserts input is IJSONSchemaDocument {}

export function validateJSONSchemaDocument(
	schema: IJSONSchemaObject,
): asserts schema is IJSONSchemaDocument {
	const isValidSchemaID =
		"$id" in schema &&
		typeof schema.$id === "string" &&
		schema.$id.trim().length !== 0;

	if (!isValidSchemaID) {
		throw new Error(`Schema document must have a non-empty "$id".`);
	}

	const isValidTitle =
		"title" in schema &&
		typeof schema.title === "string" &&
		schema.title.trim().length !== 0;

	if (!isValidTitle) {
		throw new Error(`Schema document must have a non-empty "title".`);
	}

	const isValidType = "type" in schema && isJSONSchemaTypeString(schema.type);
	const isEnum = "enum" in schema && Array.isArray(schema.enum);
	const isConst = "const" in schema;
	const isComposite =
		("allOf" in schema && Array.isArray(schema.allOf)) ||
		("anyOf" in schema && Array.isArray(schema.anyOf)) ||
		("oneOf" in schema && Array.isArray(schema.oneOf));
	const isValidShape = isValidType || isEnum || isConst || isComposite;

	if (!isValidShape) {
		throw new Error(
			"Schema document must have a known type or a enum or a const or a composite.",
		);
	}
}
