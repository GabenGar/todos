import { type Schema, validate } from "schema-utils";
import { applyMethod } from "./apply.js";
import type { IPWAWebpackPluginOptions } from "./options.js";
import schema from "./options.schema.json" with { type: "json" };
import { pluginName } from "./types.js";

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

  apply = applyMethod;
}
