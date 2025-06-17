import pgPromiseLib from "pg-promise";
import { parseConfig } from "../../lib/parse-configuration.mjs";
import { log } from "node:console";

await run();

async function run() {
  log("Purging development database...");

  const config = await parseConfig(true);
  const connectionData = config.database.migrations;
  /**
   * @type {import("pg-promise").IInitOptions}
   */
  const initOptions = {
    capSQL: true,
  };
  const pgPromise = pgPromiseLib(initOptions);

  /**
   * @type {import("pg-promise/typescript/pg-subset").IConnectionParameters}
   */
  const connectionOptions = { ...connectionData };

  /**
   * @type {import("pg-promise").IDatabase<{}, import("pg-promise/typescript/pg-subset").IClient>}
   */
  const database = pgPromise(connectionOptions);
  const query = `
    DROP SCHEMA IF EXISTS public CASCADE;

    CREATE SCHEMA IF NOT EXISTS public;
  `;
  await database.any(query);
  database.$pool.end();

  log("Purged development database.");
}
