import { DATABASE_CONNECTION_DATA } from "#server/environment";
import { runner as migrationsRunner, type RunnerOption } from "node-pg-migrate";

export async function runMigrations() {
  const options: RunnerOption = {
    databaseUrl: DATABASE_CONNECTION_DATA,
    dir: "./src/.server/database/migrations",
    direction: "up",
    migrationsTable: "migrations"
  };
  const migrations = await migrationsRunner(options);
}
