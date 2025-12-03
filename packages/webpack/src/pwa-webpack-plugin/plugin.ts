import { validate } from "schema-utils";
import type { Compiler } from "webpack";
import schema from "./plugin.schema.json" with { type: "json" };

const configuration = {
  name: "PWAWebpackPlugin",
  baseDataPath: "options",
};

export class PWAWebpackPlugin {
  constructor(options = {}) {
    validate(schema, options, configuration);
  }
  apply(compiler: Compiler) {
    compiler.hooks.emit.tapPromise("PWAWebpackPlugin", async (compilation) => {
      // Manipulate the build using the plugin API provided by webpack
      // compilation.addModule();
    });
  }
}
