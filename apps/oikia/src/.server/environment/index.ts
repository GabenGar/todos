import { getConfiguration } from "#server/lib/configuration";

const config = getConfiguration();

export const DATABASE_CONNECTION_DATA = config.database;
