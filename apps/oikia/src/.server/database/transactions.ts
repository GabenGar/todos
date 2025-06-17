import { database, pgPromise } from "./database";
import type { ITransaction } from "./types";

const { TransactionMode, isolationLevel } = pgPromise.txMode;

const strictTransactionMode = new TransactionMode({
  tiLevel: isolationLevel.serializable,
});

const readOnlyTransactionMode = new TransactionMode({
  readOnly: true,
});

export async function runTransaction<ReturnShape>(
  dbFunction: (transaction: ITransaction) => Promise<ReturnShape>,
): ReturnType<typeof dbFunction> {
  const result = await database.tx(dbFunction);

  return result;
}

export async function runStrictTransaction<ReturnShape>(
  dbFunction: (transaction: ITransaction) => Promise<ReturnShape>,
): ReturnType<typeof dbFunction> {
  const result = await database.tx({ mode: strictTransactionMode }, dbFunction);

  return result;
}

export async function runReadOnlyTransaction<ReturnShape>(
  dbFunction: (transaction: ITransaction) => Promise<ReturnShape>,
): ReturnType<typeof dbFunction> {
  const result = await database.tx(
    { mode: readOnlyTransactionMode },
    dbFunction,
  );

  return result;
}
