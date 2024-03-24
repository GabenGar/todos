import { createMultiLineString } from "#strings";
import type { IJSONSchemaObject } from "./types.js";

export function toTypeBody(
	schema: IJSONSchemaObject,
	isSymbolDeclaration = false,
): string {
	let body: string;

	switch (schema.type) {
		case "null": {
			body = "null";
			break;
		}
		case "boolean": {
			body = "boolean";
			break;
		}
		case "integer": {
			body = "number";
			break;
		}
		case "number": {
			body = "number";
			break;
		}
		case "string": {
			body = "string";
			break;
		}
		case "object": {
			body = createObjectBody(schema, isSymbolDeclaration);
			break;
		}
		case "array": {
			body = createArrayBody(schema, isSymbolDeclaration);
			break;
		}

		default: {
			if (schema.enum) {
				body = createEnumBody(schema.enum, isSymbolDeclaration);
				break;
			}

			if (schema.const) {
				body = createConstBody(schema.const, isSymbolDeclaration);
				break;
			}

			if (schema.allOf) {
				body = createAllOfBody(schema.allOf, isSymbolDeclaration);
				break;
			}

			if (schema.anyOf) {
				body = createAnyOfBody(schema.anyOf, isSymbolDeclaration);
				break;
			}

			if (schema.oneOf) {
				body = createOneOfBody(schema.oneOf, isSymbolDeclaration);
				break;
			}

			throw new Error(
				`Schemas without type must be composite or have "enum" or "const" keyword`,
			);
		}
	}

	return body;
}

export function createObjectBody(
	schema: IJSONSchemaObject,
	isSymbolDeclaration = false,
) {
	const requiredProperties = schema.required;

	const properties =
		schema.properties &&
		Object.entries(schema.properties).map<string>(
			([propertyName, propertySchema]) => {
				const fieldName = requiredProperties?.includes(propertyName)
					? propertyName
					: `${propertyName}?`;
				// @ts-expect-error fix the underlying schema type
				return `${fieldName}: ${toTypeBody(propertySchema)};`;
			},
		);

	/**
	 * As per [docs](https://json-schema.org/understanding-json-schema/reference/object#additionalproperties):
	 * > By default any additional properties are allowed.
	 */
	const additionalProperties = schema.additionalProperties ?? true;
	const isRecordSchema = additionalProperties && !properties;

	if (isRecordSchema) {
		const body = createRecordBody(isSymbolDeclaration);

		return body;
	}

	const lines = ["{"];

	if (properties) {
		lines.push(...properties);
	}

	if (additionalProperties) {
		if (additionalProperties !== true) {
			throw new Error(`Unsupported "additionalProperties" value.`);
		}

		if (isSymbolDeclaration) {
			lines.unshift("extends Record<string, unknown>");
		} else {
			lines.push("[index: string]: unknown;");
		}
	}

	lines.push("}");

	const body = createMultiLineString(...lines);

	return body;
}

function createRecordBody(isSymbolDeclaration = false) {
	return isSymbolDeclaration
		? "extends Record<string, unknown> {}"
		: "Record<string, unknown>";
}

function createArrayBody(
	schema: IJSONSchemaObject,
	isSymbolDeclaration = false,
): string {
	const itemsSchema = schema.items;
	const prefixItems = schema.prefixItems;
	const contains = schema.contains;
	const containsType =
		contains && (contains === true ? "unknown" : toTypeBody(contains));
	let itemType = "unknown";

	if (prefixItems) {
		const types = prefixItems.map((schema) => {
			// @ts-expect-error fix the underlying schema type
			const typeBody = schema === true ? "unknown" : toTypeBody(schema);

			return typeBody;
		});

		const extraItems = schema.items ?? true;

		if (extraItems) {
			if (extraItems === true) {
				types.push("...unknown[]");
			} else {
				types.push(`...(${toTypeBody(extraItems)})[]`);
			}
		}

		const body = `[${types.join(",")}]`;

		return body;
	}

	if (itemsSchema && itemsSchema !== true) {
		const typeBody = toTypeBody(itemsSchema);
		itemType = !containsType ? typeBody : `${typeBody} | ${containsType}`;
	}

	const body = isSymbolDeclaration
		? `extends Array<${itemType}> {}`
		: `Array<${itemType}>`;

	return body;
}

function createEnumBody(
	enumValue: Required<IJSONSchemaObject>["enum"],
	isSymbolDeclaration = false,
) {
	const bodyLiterals = enumValue.map((value) => JSON.stringify(value));
	const body = bodyLiterals.join("|");

	return body;
}

function createConstBody(
	constValue: Required<IJSONSchemaObject>["const"],
	isSymbolDeclaration = false,
) {
	const body = JSON.stringify(constValue);

	return body;
}

function createAllOfBody(
	allOf: Required<IJSONSchemaObject>["allOf"],
	isSymbolDeclaration = false,
) {
	const types = allOf.map((schema) => {
		// @ts-expect-error fix the underlying schema type
		const body = schema === true ? "unknown" : toTypeBody(schema);

		return body;
	});
	const body = types.join("&");

	return body;
}

function createAnyOfBody(
	anyOf: Required<IJSONSchemaObject>["anyOf"],
	isSymbolDeclaration = false,
) {
	const types = anyOf.map((schema) => {
		// @ts-expect-error fix the underlying schema type
		const body = schema === true ? "unknown" : toTypeBody(schema);

		return body;
	});
	const body = types.join("|");

	return body;
}

function createOneOfBody(
	oneOf: Required<IJSONSchemaObject>["oneOf"],
	isSymbolDeclaration = false,
) {
	const types = oneOf.map((schema) => {
		// @ts-expect-error fix the underlying schema type
		const body = schema === true ? "unknown" : toTypeBody(schema);

		return body;
	});
	const body = types.join("|");

	return body;
}
