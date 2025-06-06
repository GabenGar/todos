import pgPromiseLib, { type IInitOptions } from "pg-promise";
import { DATABASE_CONNECTION_DATA } from "#server/environment";

const initOptions: IInitOptions = {
  capSQL: true,
};
const connectionOptions = { ...DATABASE_CONNECTION_DATA };

export const pgPromise = pgPromiseLib(initOptions);
const pg = pgPromise.pg;

// return timestamps as plain strings in order to avoid dealing
// with `Date`-related nonsense in the stack
// also return them as a strict subset of RFC 3339 and ISO 8601
// https://ijmacd.github.io/rfc3339-iso8601/
pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, (timestamptz) => {
  const rfc3339DateTime = timestamptz.replace(" ", "T");

  return rfc3339DateTime;
});

export const database = pgPromise(connectionOptions);
