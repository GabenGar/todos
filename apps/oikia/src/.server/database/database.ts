import { DATABASE_CONNECTION_DATA } from "#server/environment";
import pgPromiseLib, { type IInitOptions } from "pg-promise";

const initOptions: IInitOptions = {
  capSQL: true,
};
const connectionOptions = { ...DATABASE_CONNECTION_DATA };

export const pgPromise = pgPromiseLib(initOptions);
export const database = pgPromise(connectionOptions);
