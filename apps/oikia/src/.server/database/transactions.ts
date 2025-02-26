import { database, pgPromise } from "./database";
import type { ITransactionFunction } from "./types";

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
  dbFunction: ITransactionFunction<ReturnShape>
) {
  const result = await database.tx(dbFunction);

  return result;
}
