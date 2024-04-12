import path from "node:path";
import fs from "node:fs/promises";
import { transformSchemaDocumentToModule } from "./document.js";
import {
	defaultJSONSchemaFileExtension,
	type IJSONSchemaDocument,
} from "./types.js";

/**
 * A mapping of paths relative to `inputFolder`
 * and schema documents.
 */
interface ISchemaMap extends Map<string, IJSONSchemaDocument> {}
/**
 * A mapping of `"$id"`s and schema documents.
 */
interface ISchemaIDMap extends Map<string, IJSONSchemaDocument> {}
/**
 * A mapping of paths relative to `inputFolder`
 * and module code.
 */
interface IModuleMap extends Map<string, string> {}

export async function transformFolderToModules(
	inputFolder: string,
	outputFolder: string,
) {
	console.info(
		`Creating modules at folder "${outputFolder}" from schema folder "${inputFolder}"...`,
	);

	const schemaMap = await collectSchemas(inputFolder);
	const moduleMap = createModules(schemaMap);
	await saveModules(outputFolder, moduleMap);
}

async function collectSchemas(inputFolder: string): Promise<ISchemaMap> {
	const folder = await fs.opendir(inputFolder);
	const schemaMap: ISchemaMap = new Map();

	for await (const entry of folder) {
		const isValidJSONSchemaFile =
			entry.isFile() && entry.name.endsWith(defaultJSONSchemaFileExtension);

		if (!isValidJSONSchemaFile) {
			continue;
		}

		const filePath = path.join(entry.path, entry.name);
		const fileContent = await fs.readFile(filePath, { encoding: "utf8" });
		const schema: IJSONSchemaDocument = JSON.parse(fileContent);
		const schemaPath = path.relative(inputFolder, filePath);

		schemaMap.set(schemaPath, schema);
	}

	return schemaMap;
}

function createModules(schemaMap: ISchemaMap): IModuleMap {
	const schemaIDMap = createSchemaIDMapping(schemaMap);
	const moduleMap: IModuleMap = new Map();
	const getExternalDocument: Required<
		Parameters<typeof transformSchemaDocumentToModule>
	>[1] = (ref) => {
		const schemaDocument = schemaIDMap.get(ref);

		if (!schemaDocument) {
			throw new Error(`Failed to find schema document for ref "${ref}"`);
		}

		return schemaDocument;
	};
	const getModuleData: Required<
		Parameters<typeof transformSchemaDocumentToModule>
	>[2] = (schemaDocumentID, ref) => {
		const documentSchema = schemaIDMap.get(schemaDocumentID);
		const refSchema = schemaIDMap.get(ref);

		if (!documentSchema) {
			throw new Error(
				`Schema Document ID "${schemaDocumentID}" does not exist.`,
			);
		}

		if (!refSchema) {
			throw new Error(`Schema at ref "${ref}" does not exist.`);
		}

		const documentPaths = findKeysByValue(schemaMap, documentSchema);
		const refPaths = findKeysByValue(schemaMap, refSchema);

		if (!documentPaths) {
			throw new Error(
				`Failed to find the path for schema ID "${documentSchema.$id}"`,
			);
		}

		if (!refPaths) {
			throw new Error(
				`Failed to find the path for schema ID "${refSchema.$id}"`,
			);
		}

		// biome-ignore lint/style/noNonNullAssertion: it's non-empty
		const documentPath = getFirstElement(documentPaths)!;
		// biome-ignore lint/style/noNonNullAssertion: it's non-empty
		const refpath = getFirstElement(refPaths)!;
		const modulePath = path.relative(
			documentPath,
			refpath.replace(".schema.json", ""),
		);

		const result: ReturnType<typeof getModuleData> = {
			symbolName: `I${refSchema.title}`,
			// prepend `./` if it's missing
			modulePath: modulePath.startsWith(".") ? modulePath : `./${modulePath}`,
		};

		return result;
	};

	for (const [schemaPath, schemaDocument] of schemaMap) {
		const module = transformSchemaDocumentToModule(
			schemaDocument,
			getExternalDocument,
			getModuleData,
		);

		moduleMap.set(schemaPath, module);
	}

	return moduleMap;
}

function createSchemaIDMapping(schemaMap: ISchemaMap): ISchemaIDMap {
	const schemaIDMap: ISchemaIDMap = new Map();

	for (const [schemaPath, schema] of schemaMap) {
		const duplicateSchema = schemaIDMap.get(schema.$id);

		if (duplicateSchema) {
			// biome-ignore lint/style/noNonNullAssertion: it's a map of files and schemas
			const schemaPaths = findKeysByValue(schemaMap, duplicateSchema)!;
			const pathList = Array.from(schemaPaths)
				.map((schemaPath) => `"${schemaPath}"`)
				.join(", ");
			const message = `Schema with ID "${schema.$id}" at "${schemaPath}" shares ID with ${pathList}.`;

			throw new Error(message);
		}

		schemaIDMap.set(schema.$id, schema);
	}

	return schemaIDMap;
}

function findKeysByValue<KeyType, ValueType>(
	inputMap: Map<KeyType, ValueType>,
	value: ValueType,
): undefined | Set<KeyType> {
	const keys: Set<KeyType> = new Set();

	for (const [inputKey, inputValue] of inputMap) {
		if (value !== inputValue) {
			continue;
		}

		keys.add(inputKey);
	}

	return keys.size === 0 ? undefined : keys;
}

function getFirstElement<ValueType>(
	inputSet: Set<ValueType>,
): ValueType | undefined {
	let result = undefined;

	for (const value of inputSet) {
		result = value;
		break;
	}

	return result;
}

async function saveModules(outputFolder: string, moduleMap: IModuleMap) {
	console.debug(`Writing ${moduleMap.size} files...`);

	for await (const [relativePath, moduleCode] of moduleMap) {
		const filePath = path.join(outputFolder, `${relativePath}.ts`);
		await fs.writeFile(filePath, moduleCode, { encoding: "utf8" });
	}
}
