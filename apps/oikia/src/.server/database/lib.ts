import { runner as migrationsRunner, type RunnerOption } from "node-pg-migrate";

export async function runMigrations() {
  const options: RunnerOption = {};
  const migrations = await migrationsRunner(options);
}
