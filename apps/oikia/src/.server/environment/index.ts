import { getConfiguration } from "#server/lib/configuration";

const config = getConfiguration();

export const DATABASE_CONNECTION_DATA = config.database.administrator;
export const MIGRATIONS_CONNECTION_DATA = config.database.migrations;
export const SESSION_SECRET_KEY = config.server.secret_key;
