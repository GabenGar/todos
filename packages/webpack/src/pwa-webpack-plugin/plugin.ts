import { validate, type Schema } from "schema-utils";
import {
  type AssetInfo,
  type Chunk,
  type Compiler,
  Compilation,
} from "webpack";
import schema from "./options.schema.json" with { type: "json" };
import type { IPWAWebpackPluginOptions } from "./options.js";

const pluginName = "PWAWebpackPlugin";
const configuration = {
  name: pluginName,
  baseDataPath: "options",
};

export class PWAWebpackPlugin {
  options: IPWAWebpackPluginOptions;

  constructor(options: IPWAWebpackPluginOptions) {
    validate(schema as Schema, options, configuration);

    this.options = options;
  }

  apply(compiler: Compiler): void {
    const { thisCompilation } = compiler.hooks;
    thisCompilation.tap(pluginName, (compilation) => {
      const { hooks, getPath, outputOptions } = compilation;
      const { processAssets } = hooks;
      const hashDigestLength = outputOptions.hashDigestLength;
      const publicPath = getPath(outputOptions.publicPath);
		  let manifest = {};

      processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (compilationAssets) => {},
      );

      processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (compilationAssets) => {},
      );

      /**
       * @param name name
       * @param info asset info
       * @returns {} hash removed name
       */
      function removeHash(name: string, info: AssetInfo | null): string {
        // Handles hashes that match configured `hashDigestLength`
        // i.e. index.XXXX.html -> index.html (html-webpack-plugin)
        if (hashDigestLength <= 0) return name;
        const reg = createHashRegExp(`[a-f0-9]{${hashDigestLength},32}`);

        return name.replace(reg, "");
      }
    });
  }
}

function extname(filename: string): string {
  const replaced = filename.replace(/\?.*/, "");
  const split = replaced.split(".");
  const last = split.pop();

  if (!last) return "";

  return last && /^(gz|br|map)$/i.test(last) ? `${split.pop()}.${last}` : last;
}

/**
 * @returns regexp to remove hash
 */
function createHashRegExp(value: string | string[]): RegExp {
  return new RegExp(
    `(?:\\.${Array.isArray(value) ? `(${value.join("|")})` : value})(?=\\.)`,
    "gi",
  );
}

/**
 * @param chunk chunk
 * @returns chunk name or chunk id
 */
function getName(chunk: Chunk): Chunk["name"] | Chunk["id"] {
  if (chunk.name) return chunk.name;

  return chunk.id;
}
