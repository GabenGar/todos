import { getQueryFile, toOrderedEntities, type ITransaction } from "#database";
import type { IAccountDB, IAccountDBPreview } from "./types";

const query = getQueryFile("accounts", "previews.sql");

export async function selectAccountPreviews(
  transaction: ITransaction,
  ids: IAccountDB["id"][],
): Promise<IAccountDBPreview[]> {
  const params = {
    ids,
  };

  const accounts = await transaction.many<IAccountDBPreview>(query, params);
  const orderedAccounts = toOrderedEntities(ids, accounts);

  return orderedAccounts;
}
