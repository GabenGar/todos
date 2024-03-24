import fs from "node:fs/promises";
import path from "node:path";
import { transformSchemaDocumentToModule } from "../../../dist/src/transform/index.js";
import type { ITestModuleGenerator } from "../../../src/tests/types.js";

const generate: ITestModuleGenerator = async (inputs) => {
  const outputs = new Map();

  for await (const dirent of inputs) {
    const filePath = path.join(dirent.path, dirent.name);
    const content = await fs.readFile(filePath, { encoding: "utf8" });
    const schema: Parameters<typeof transformSchemaDocumentToModule>[0] =
      JSON.parse(content);

    const schemaInterface = transformSchemaDocumentToModule(schema);
    const outputFilename = dirent.name.replace(".schema.json", ".ts");

    outputs.set(outputFilename, schemaInterface);
  }

  return outputs;
};

export default generate;
