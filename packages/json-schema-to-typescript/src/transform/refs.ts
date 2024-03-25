import { get as getValueFromPointer } from "@hyperjump/json-pointer";
import { validateJSONSchemaObject } from "./validate.js";
import type {
	IDocumentRefs,
	IGetSchemaDocument,
	IJSONSchemaDocument,
	IJSONSchemaObject,
	IRefMap,
	ISchemaRef,
} from "./types.js";

export function collectDocumentRefs(
	schemaDocument: IJSONSchemaDocument,
): IDocumentRefs {
	const documentRefs = collectSchemaRefs(schemaDocument, new Set<ISchemaRef>());

	// validate refs
	for (const ref of documentRefs) {
		const isLocalRef = ref.startsWith("#");

		if (!isLocalRef) {
			const isValidExternalRef = !ref.includes("#") || ref.endsWith("#");

			if (isValidExternalRef) {
				continue;
			}

			throw new Error(
				`External \`"$ref"\` "${ref}" of schema document "${schemaDocument.$id}" must not have any symbols after "pound me" ("#") sign.`,
			);
		}

		const isValidLocalRef = ref.startsWith("#/$defs");

		if (!isValidLocalRef) {
			throw new Error(`Local \`"$ref"\` "${ref}" is not valid.`);
		}
	}

	return documentRefs;
}

export function collectSchemaRefs(
	schema: IJSONSchemaObject,
	documentRefs: IDocumentRefs,
): IDocumentRefs {
	if (schema.$ref) {
		documentRefs.add(schema.$ref);
	}

	if (schema.properties) {
		Object.values(schema.properties).forEach((schema) => {
			if (typeof schema === "boolean") {
				return;
			}

			collectSchemaRefs(schema, documentRefs);
		});
	}

	if (schema.items && schema.items !== true) {
		collectSchemaRefs(schema.items, documentRefs);
	}

	return documentRefs;
}

export function createRefMapping(
	schemaDocument: IJSONSchemaDocument,
	documentRefs: IDocumentRefs,
	getExternalDocument?: IGetSchemaDocument,
): IRefMap {
	const refMap: IRefMap = new Map();

	for (const ref of documentRefs) {
    const isLocalRef = ref.startsWith("#")
		// remove `pound me` sign because `json-pointer` doesn't like it
		const preppedRef = ref.startsWith("#") ? ref.slice(1) : ref;
		const schema = getValueFromPointer(preppedRef, schemaDocument);
		validateJSONSchemaObject(schema);

		const parsedTitle = schema.title?.trim();

		if (!parsedTitle) {
			throw new Error(
				`The ref "${ref}" at schema document "${schemaDocument.$id}" does not have a "title" property.`,
			);
		}

		const symbolName = `I${parsedTitle}`;

		refMap.set(ref, { symbolName, schema });
	}

	return refMap;
}
