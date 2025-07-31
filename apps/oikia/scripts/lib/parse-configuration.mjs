import path from "node:path";
import { cwd } from "node:process";
import fs from "node:fs/promises";
import { lint, parser } from "@exodus/schemasafe";

/**
 * @typedef IConfiguration
 * @property {IServerConfiguration} server
 * @property {IDatabaseConfiguration} database
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
 * @returns {Promise<IConfiguration>}
 */
export async function parseConfig(isDevelopment) {
  const schemaBasePath = path.join(cwd(), "schema");
  const configBasePath = path.join(cwd(), "config");
  const configSchemaPath = path.join(schemaBasePath, "server.schema.json");
  const configPath = path.join(
    configBasePath,
    isDevelopment ? "server.development.json" : "server.json"
  );

  const schemaContent = await fs.readFile(configSchemaPath, {
    encoding: "utf-8",
  });
  /**
   * @type {import("@exodus/schemasafe").Schema}
   */
  const schema = JSON.parse(schemaContent);

  const schemaErrors = lint(schema, { mode: "strong" });

  if (schemaErrors.length !== 0) {
    throw new AggregateError(
      schemaErrors,
      "Failed to validate server configuration schema."
    );
  }

  const configParser = parser(schema, { includeErrors: true });

  const configContent = await fs.readFile(configPath, { encoding: "utf-8" });

  const result = configParser(configContent);

  if (!result.valid) {
    throw new Error("Failed to parse server configuration.", {
      cause: result.error,
    });
  }

  /**
   * @type {IConfiguration}
   */
  // @ts-expect-error just generic shit
  const config = result.value;

  return config;
}
