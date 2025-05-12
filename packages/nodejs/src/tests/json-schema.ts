import fs from "node:fs/promises";
import path from "node:path";
import {
  type IGetModuleData,
  type IGetSchemaDocument,
  transformSchemaDocumentToModule,
  validateJSONSchemaDocument,
} from "#transform";
import type { ITestModuleGenerator } from "./types.js";

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
  const getModuleData: IGetModuleData = (schemaDocumentID, ref) => {
    const documentData = schemaDataMap.get(schemaDocumentID);
    const refData = schemaDataMap.get(ref);

    if (!documentData) {
      throw new Error(
        `Schema Document ID "${schemaDocumentID}" does not exist.`,
      );
    }

    if (!refData) {
      throw new Error(`Schema at ref "${ref}" does not exist.`);
    }

    const modulePath = path
      .relative(
        path.dirname(documentData.fullPath),
        path.join(
          path.dirname(refData.fullPath),
          refData.fileName.replace(".schema.json", ""),
        ),
      )
      .replace("\\", "/");

    const result: ReturnType<IGetModuleData> = {
      // prepend `./` if it's missing
      modulePath: modulePath.startsWith(".") ? modulePath : `./${modulePath}`,
      symbolName: `I${refData.schema.title}`,
    };

    return result;
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
    try {
      const schemaInterface = transformSchemaDocumentToModule(
        schema,
        getSchemaDocument,
        getModuleData,
      );
      const outputFilename = fileName.replace(".schema.json", ".ts");

      outputs.set(outputFilename, schemaInterface);
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      throw new Error(
        `Failed to transform schema "${id}" at "${fullPath}" into typescript module.`,
        // @ts-expect-error Typescript version disagreement
        { cause: error },
      );
    }
  }

  return outputs;
}
