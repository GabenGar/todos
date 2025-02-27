import type { IAccountInit } from "#entities/account";
import {
  getQueryFile,
  toEntityIDs,
  type IEntityRow,
  type ITransaction,
} from "#database";
import type { IAccountDB } from "./types";

const query = getQueryFile("accounts", "insert.sql");

export async function insertAccounts(
  transaction: ITransaction,
  inits: IAccountInit[]
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
