import path from "node:path";
import { cwd } from "node:process";
import { runner as runMigrations, type RunnerOption } from "node-pg-migrate";
import {
  MIGRATIONS_CONNECTION_DATA,
} from "#server/environment";
import { pgPromise } from "./database";
import type { IEntityRow } from "./types";

const queryFileBasePath = path.join(
  cwd(),
  "src",
  ".server",
  "database",
  "queries",
);

export function getQueryFile(...pathSegments: string[]) {
  const fullPath = path.join(queryFileBasePath, ...pathSegments);
  const queryFile = new pgPromise.QueryFile(fullPath, { minify: true });

  return queryFile;
}

export function toEntityIDs<EntityType extends IEntityRow>(
  entities: EntityType[],
) {
  const ids = entities.map(({ id }) => id);

  return ids;
}

export async function migrateDatabase() {
  const options: RunnerOption = {
    databaseUrl: MIGRATIONS_CONNECTION_DATA,
    dir: "./src/.server/database/migrations",
    direction: "up",
    migrationsTable: "migrations",
    checkOrder: true,
  };
  await runMigrations(options);
}
