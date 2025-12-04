import { validate, type Schema } from "schema-utils";
import type { Compiler } from "webpack";
import schema from "./options.schema.json" with { type: "json" };
import type { IPWAWebpackPluginOptions } from "./options.js";

const configuration = {
  name: "PWAWebpackPlugin",
  baseDataPath: "options",
};

export class PWAWebpackPlugin {
  options: IPWAWebpackPluginOptions;

  constructor(options: IPWAWebpackPluginOptions) {
    const resolvedOptions = options ?? {};

    validate(schema as Schema, resolvedOptions, configuration);

    this.options = resolvedOptions;
  }
  apply(compiler: Compiler) {
    compiler.hooks.done.tapPromise("PWAWebpackPlugin", async (compilation) => {
      console.log(
        `Hello ${this.options.name}! - ${compilation.compilation.fullHash}`,
      );
    });
  }
}
