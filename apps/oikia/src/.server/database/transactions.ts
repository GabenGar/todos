import { database, pgPromise } from "./database";
import type { ITransaction } from "./types";

const { TransactionMode, isolationLevel } = pgPromise.txMode;

/**
 * - serializable
 * - read-only
 * - deferrable
 */
export const strictTransactionMode = new TransactionMode({
  tiLevel: isolationLevel.serializable,
  readOnly: true,
  deferrable: true,
});

export async function runTransaction<ReturnShape>(
  dbFunction: (transaction: ITransaction) => Promise<ReturnShape>,
): ReturnType<typeof dbFunction> {
  const result = await database.tx(dbFunction);

  return result;
}
