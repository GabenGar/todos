import fs from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { lint, parser } from "@exodus/schemasafe";

/**
 * @typedef IConfiguration
 * @property {IServerConfiguration} server
 * @property {IDatabaseConfiguration} database
 */

/**
 * @typedef IPublicConfiguration
 * @property {boolean} [is_translation_debug_enabled]
 */

/**
 * @typedef IServerConfiguration
 * @property {number} port
 */

/**
 * @typedef IDatabaseConfiguration
 * @property {IDatabaseConnection} migrations
 * @property {IDatabaseConnection} administrator
 */

/**
 * @typedef IDatabaseConnection
 * @property {string} user
 * @property {string} host
 * @property {number} port
 * @property {string} database
 * @property {string} [password]
 */

/**
 * @param {boolean} [isDevelopment]
 * @returns {Promise<{server: IConfiguration, public:IPublicConfiguration }>}
 */
export async function parseConfig(isDevelopment) {
  const schemaBasePath = path.join(cwd(), "schema");
  const configBasePath = path.join(cwd(), "config");
  const configSchemaPath = path.join(schemaBasePath, "server.schema.json");
  const publicConfigSchemaPath = path.join(schemaBasePath, "public.schema.json");
  const configPath = path.join(
    configBasePath,
    isDevelopment ? "server.development.json" : "server.json",
  );
  const publicConfigPath = path.join(
    configBasePath,
    isDevelopment ? "public.development.json" : "public.json",
  );

  const schemaContent = await fs.readFile(configSchemaPath, {
    encoding: "utf-8",
  });
  const publicSchemaContent = await fs.readFile(publicConfigSchemaPath, {
    encoding: "utf-8",
  });

  /**
   * @type {import("@exodus/schemasafe").Schema}
   */
  const schema = JSON.parse(schemaContent);
  /**
   * @type {import("@exodus/schemasafe").Schema}
   */
  const publicSchema = JSON.parse(publicSchemaContent);

  const schemaErrors = lint(schema, { mode: "strong" });

  if (schemaErrors.length !== 0) {
    throw new AggregateError(
      schemaErrors,
      "Failed to validate server configuration schema.",
    );
  }

  const publicSchemaErrors = lint(publicSchema, { mode: "strong" });

  if (publicSchemaErrors.length !== 0) {
    throw new AggregateError(
      schemaErrors,
      "Failed to validate public configuration schema.",
    );
  }

  const parseConfig = parser(schema, { includeErrors: true });
  const parsePublicConfig = parser(publicSchema, { includeErrors: true });

  const configContent = await fs.readFile(configPath, { encoding: "utf-8" });
  const publicConfigContent = await fs.readFile(publicConfigPath, { encoding: "utf-8" });

  const result = parseConfig(configContent);

  if (!result.valid) {
    throw new Error("Failed to parse server configuration.", {
      cause: result.error,
    });
  }

  const publicResult = parsePublicConfig(publicConfigContent);

  if (!publicResult.valid) {
    throw new Error("Failed to parse public configuration.", {
      cause: result.error,
    });
  }

  /**
   * @type {IConfiguration}
   */
  // @ts-expect-error just generic shit
  const serverConfig = result.value;
  /**
   * @type {IPublicConfiguration}
   */
  // @ts-expect-error just generic shit
  const publicConfig = publicResult.value;
  

  return { server: serverConfig, public: publicConfig };
}
