import {
  getQueryFile,
  toEntityIDs,
  type IEntityRow,
  type ITransaction,
} from "#database";
import type { IAccountDB, IAccountDBInit } from "./types";

const query = getQueryFile("accounts", "insert.sql");

export async function insertAccounts(
  transaction: ITransaction,
  inits: IAccountDBInit[],
): Promise<IAccountDB["id"][]> {
  const params = { inits };

  if (inits.length === 1) {
    const { id } = await transaction.one<IEntityRow>(query, params);

    return [id];
  }

  const results = await transaction.many<IEntityRow>(query, params);
  const ids = toEntityIDs(results);

  return ids;
}
