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
	isExternalsAllowed = false,
): { local: IDocumentRefs; external: IDocumentRefs } {
	const documentRefs = collectSchemaRefs(schemaDocument, new Set<ISchemaRef>());
	const localRefs: IDocumentRefs = new Set();
	const externalRefs: IDocumentRefs = new Set();

	for (const ref of documentRefs) {
		const refType = guessRefType(ref, isExternalsAllowed);

		if (refType === "external") {
			externalRefs.add(ref);
		} else {
			localRefs.add(ref);
		}
	}

	return { external: externalRefs, local: localRefs };
}

function guessRefType(
	ref: ISchemaRef,
	isExternalsAllowed: boolean,
): "local" | "external" {
	const isLocalRef = ref.startsWith("#");

	if (!isLocalRef) {
		validateExternalRef(ref, isExternalsAllowed);

		return "external";
	}

	validateLocalRef(ref);

	return "local";
}

function validateExternalRef(ref: ISchemaRef, isExternalsAllowed: boolean) {
	const isValidRef =
		isExternalsAllowed && (!ref.includes("#") || ref.endsWith("#"));

	if (!isValidRef) {
		throw new Error(
			`External \`"$ref"\` "${ref}" must not have any symbols after "pound me" ("#") sign.`,
		);
	}
}
function validateLocalRef(ref: ISchemaRef) {
	if (!ref.startsWith("#/$defs")) {
		throw new Error(`Local \`"$ref"\` "${ref}" is not valid.`);
	}
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
		const isLocalRef = ref.startsWith("#");
		let schema: unknown;

		if (!isLocalRef) {
			if (!getExternalDocument) {
				throw new Error(
					`External \`"$ref"\` "${ref}" at schema document "${schemaDocument.$id}" cannot be resolved because the resolving function was not provided.`,
				);
			}

			const [documentRef, jsonPointer] = ref.split("#");
			const externalSchemaDocument = getExternalDocument(documentRef);
			schema = !jsonPointer
				? externalSchemaDocument
				: getValueFromPointer(jsonPointer, externalSchemaDocument);
		} else {
			// remove `pound me` sign because `json-pointer` doesn't like it
			const preppedRef = ref.startsWith("#") ? ref.slice(1) : ref;
			schema = getValueFromPointer(preppedRef, schemaDocument);
		}

		validateJSONSchemaObject(schema);

		const parsedTitle = schema.title?.trim();

		// @TODO infer from key name in case of missing title
		if (!parsedTitle) {
			throw new Error(
				`The \`"$ref"\` "${ref}" at schema document "${schemaDocument.$id}" does not have a "title" property.`,
			);
		}

		const symbolName = `I${parsedTitle}`;

		refMap.set(ref, { symbolName, schema });
	}

	return refMap;
}
