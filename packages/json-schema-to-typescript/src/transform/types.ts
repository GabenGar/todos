import { JsonSchemaDraft202012 } from "@hyperjump/json-schema/draft-2020-12";

export type IJSONSchema = Exclude<JsonSchemaDraft202012, boolean>;

export type IJSONSchemaType = Exclude<
	IJSONSchema["type"],
	// biome-ignore lint/suspicious/noExplicitAny: doesn't matter for this exclusion
	Array<any> | undefined
>;

export type IJSONSchemaDocument = Omit<IJSONSchema, "title" | "type"> &
	Pick<Required<IJSONSchema>, "title"> & {
		type: IJSONSchemaType;
	};
