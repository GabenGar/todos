import type { IAccount, IAccountInit } from "#entities/account";
import {
  getQueryFile,
  toEntityIDs,
  type IEntityRow,
  type ITransaction,
} from "#database";

const query = getQueryFile("accounts", "insert.sql");

export async function insertAccounts(
  transaction: ITransaction,
  inits: IAccountInit[]
): Promise<IAccount["id"][]> {
  const params = { inits };
  const results = await transaction.many<IEntityRow>(query, params);
  const ids = toEntityIDs(results);

  return ids;
}
