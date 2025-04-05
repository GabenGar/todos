import { getConfiguration } from "#server/lib/configuration";

const config = getConfiguration();

export const DATABASE_CONNECTION_DATA = config.database;
export const SESSION_SECRET_KEY = config.server.secret_key;
export const ADMIN_INVITATION_CODE = config.server.admin_invitation_code;
