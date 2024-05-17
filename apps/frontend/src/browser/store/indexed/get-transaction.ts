import { getDatabase } from "./get-database";

export async function getTransaction(
  ...args: Parameters<IDBDatabase["transaction"]>
): Promise<IDBTransaction> {
  const db = await getDatabase();
  const transaction = db.transaction(...args);

  return transaction;
}
