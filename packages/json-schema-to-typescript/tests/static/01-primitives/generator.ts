import path from "path";
import fs from "fs/promises";
import type { ITestModuleGenerator } from "../../../src/tests/types.js";
import { transformSchemaToInterface } from "../../../dist/src/transform/index.js";

const generate: ITestModuleGenerator = async (inputs) => {
	const outputs = new Map();

	for await (const dirent of inputs) {
		const filePath = path.join(dirent.path, dirent.name);
		const content = await fs.readFile(filePath, { encoding: "utf8" });
		const schema: Parameters<typeof transformSchemaToInterface>[0] =
			JSON.parse(content);

		const schemaInterface = transformSchemaToInterface(schema);
		const outputFilename = dirent.name.replace(".schema.json", ".ts");

		outputs.set(outputFilename, schemaInterface);
	}

	return outputs;
};

export default generate;
