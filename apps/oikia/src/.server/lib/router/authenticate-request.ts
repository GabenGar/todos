import { runTransaction } from "#database";
import {
  selectAccountAuth,
  selectAccountEntities,
} from "#database/queries/accounts";
import type { IAccount, IAccountRole } from "#entities/account";
import { ClientError } from "../errors";
import { getSession } from "../sessions";

export async function authenticateRequest(
  request: Request,
  allowedRoles?: IAccountRole | IAccountRole[]
): Promise<IAccount> {
  const session = await getSession(request.headers.get("Cookie"));
  const authID = session.get("auth_id");

  if (!authID) {
    throw new ClientError("Not Found", { statusCode: 401 });
  }

  const account = await runTransaction(async (transaction) => {
    const { id } = await selectAccountAuth(transaction, {
      auth_id: authID,
    });
    const [{ id: _, ...account }] = await selectAccountEntities(transaction, [
      id,
    ]);

    return account;
  });

  // @TODO proper error handling
  if (allowedRoles) {
    if (typeof allowedRoles === "string") {
      if (account.role !== allowedRoles) {
        throw new ClientError("Not Found", { statusCode: 404 });
      }
    } else {
      if (!allowedRoles.includes(account.role)) {
        throw new ClientError("Not Found", { statusCode: 404 });
      }
    }
  }

  return account;
}
