import { getConfiguration } from "#server/lib/configuration";

const config = getConfiguration();

export const DATABASE_CONNECTION_DATA = config.server.database.administrator;
export const MIGRATIONS_CONNECTION_DATA = config.server.database.migrations;
export const SESSION_SECRET_KEY = config.server.server.secret_key;
