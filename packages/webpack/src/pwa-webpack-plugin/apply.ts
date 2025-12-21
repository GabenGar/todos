import {
  // type AssetInfo,
  // type Chunk,
  type Compiler,
  default as webpack,
} from "webpack";
import { default as webpackSources } from "webpack-sources";
import type { PWAWebpackPlugin } from "./plugin.js";
import { pluginName } from "./types.js";

const Compilation = webpack.Compilation;
const RawSource = webpackSources.RawSource;

// a typecript magic to declare the value of `this`
// outside of class declaration
// https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
export function applyMethod(this: PWAWebpackPlugin, compiler: Compiler) {
  const { thisCompilation } = compiler.hooks;

  thisCompilation.tap(pluginName, (compilation) => {
    const { hooks /*outputOptions*/ } = compilation;
    const { processAssets } = hooks;
    // const hashDigestLength = outputOptions.hashDigestLength;
    // const publicPath = compilation.getPath(outputOptions.publicPath);
    const { name, short_name } = this.options;
    const manifest = {
      name,
      short_name,
    };

    // processAssets.tap(
    //   {
    //     name: pluginName,
    //     stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
    //   },
    //   (compilationAssets) => {},
    // );

    processAssets.tap(
      {
        name: pluginName,
        stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
      },
      (_compilationAssets) => {
        compilation.emitAsset(
          "manifest.webmanifest",
          new RawSource(JSON.stringify(manifest)),
        );
      },
    );
  });
}

// function extname(filename: string): string {
//   const replaced = filename.replace(/\?.*/, "");
//   const split = replaced.split(".");
//   const last = split.pop();

//   if (!last) return "";

//   return last && /^(gz|br|map)$/i.test(last) ? `${split.pop()}.${last}` : last;
// }

// /**
//  * @returns regexp to remove hash
//  */
// function createHashRegExp(value: string | string[]): RegExp {
//   return new RegExp(
//     `(?:\\.${Array.isArray(value) ? `(${value.join("|")})` : value})(?=\\.)`,
//     "gi",
//   );
// }

// /**
//  * @param chunk chunk
//  * @returns chunk name or chunk id
//  */
// function getName(chunk: Chunk): Chunk["name"] | Chunk["id"] {
//   if (chunk.name) return chunk.name;

//   return chunk.id;
// }

// /**
//  * @param name name
//  * @param info asset info
//  * @returns hash removed name
//  */
// function removeHash(
//   hashDigestLength: number,
//   name: string,
//   info: AssetInfo | null,
// ): string {
//   // Handles hashes that match configured `hashDigestLength`
//   // i.e. index.XXXX.html -> index.html (html-webpack-plugin)
//   if (hashDigestLength <= 0) return name;

//   const reg = createHashRegExp(`[a-f0-9]{${hashDigestLength},32}`);

//   return name.replace(reg, "");
// }
