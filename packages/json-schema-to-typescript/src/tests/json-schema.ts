import fs from "node:fs/promises";
import path from "node:path";
import type { ITestModuleGenerator } from "./types.js";
import {
	transformSchemaDocumentToModule,
	validateJSONSchemaDocument,
	type IGetSchemaDocument,
} from "#lib";

interface schemaData {
	fullPath: string;
	fileName: string;
	schema: Parameters<typeof transformSchemaDocumentToModule>[0];
}

export async function generateJSONSchemaTests(
	inputs: Parameters<ITestModuleGenerator>[0],
): ReturnType<ITestModuleGenerator> {
	/**
	 * A mapping of `"$id"`s and schemas data.
	 */
	const schemaDataMap = new Map<string, schemaData>();
	const outputs = new Map();
	const getSchemaDocument: IGetSchemaDocument = (ref) => {
		const data = schemaDataMap.get(ref);

		if (!data) {
			throw new Error(`Couldn't find a schema for \`"$ref"\` "${ref}"`);
		}
		return data.schema;
	};

	for await (const dirent of inputs) {
		const filePath = path.join(dirent.path, dirent.name);
		const content = await fs.readFile(filePath, { encoding: "utf8" });
		const schema: unknown = JSON.parse(content);

		validateJSONSchemaDocument(schema);

		schemaDataMap.set(schema.$id, {
			schema,
			fullPath: filePath,
			fileName: dirent.name,
		});
	}

	for (const [id, { fullPath, fileName, schema }] of schemaDataMap) {
		const schemaInterface = transformSchemaDocumentToModule(
			schema,
			getSchemaDocument,
		);
		const outputFilename = fileName.replace(".schema.json", ".ts");

		outputs.set(outputFilename, schemaInterface);
	}

	return outputs;
}
