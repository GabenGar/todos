import { JsonSchemaDraft202012 } from "@hyperjump/json-schema/draft-2020-12";

export type IJSONSchemaObject = Exclude<JsonSchemaDraft202012, boolean>;

export type IJSONSchemaType = Exclude<
	IJSONSchemaObject["type"],
	// biome-ignore lint/suspicious/noExplicitAny: doesn't matter for this exclusion
	Array<any> | undefined
>;

export type IJSONSchemaDocument = Omit<
	IJSONSchemaObject,
	"$id" | "title" | "type"
> &
	Pick<Required<IJSONSchemaObject>, "$id" | "title"> &
	(
		| {
				type: IJSONSchemaType;
		  }
		| Pick<Required<IJSONSchemaObject>, "enum">
		| Pick<Required<IJSONSchemaObject>, "const">
		| Pick<Required<IJSONSchemaObject>, "oneOf">
		| Pick<Required<IJSONSchemaObject>, "anyOf">
		| Pick<Required<IJSONSchemaObject>, "allOf">
	);

/**
 * Retrieves a schema document from the ref.
 */
export interface IGetSchemaDocument {
	(ref: string): IJSONSchemaDocument;
}

/**
 * A mapping of `"$ref"`s and schemas with their symbol names.
 */
export interface IRefMap extends Map<ISchemaRef, IRefData> {}

export type IRefData = { symbolName: string; schema: IJSONSchemaObject };

export interface IDocumentRefs extends Set<ISchemaRef> {}

export type ISchemaRef = Required<IJSONSchemaDocument>["$ref"];

const schemaTypes = [
	"string",
	"number",
	"boolean",
	"object",
	"array",
	"null",
	"integer",
] as const satisfies IJSONSchemaType[];

export function isJSONSchemaTypeString(
	input: unknown,
): input is IJSONSchemaType {
	return schemaTypes.includes(input as IJSONSchemaType);
}
