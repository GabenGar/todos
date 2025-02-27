import { getQueryFile, type ITransaction } from "#database";
import type { IAccountDB } from "./types";

const query = getQueryFile("accounts", "insert.sql");

export async function selectAccountEntities(
  transaction: ITransaction,
  ids: IAccountDB["id"][]
): Promise<IAccountDB[]> {
  const params = {
    ids,
  };

  if (ids.length === 1) {
    const account = await transaction.one<IAccountDB>(query, params);

    return [account];
  }

  const accounts = await transaction.many<IAccountDB>(query, params);

  return accounts;
}
