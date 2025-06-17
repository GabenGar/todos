import { runTransaction } from "#database";
import {
  selectAccountAuth,
  selectAccountEntities,
  type IAccountDB,
} from "#database/queries/accounts";
import type { IAccountRole } from "#entities/account";
import { ClientError } from "../errors";
import { destroySession, getSession } from "../sessions";

export async function authenticateRequest(
  request: Request,
  allowedRoles?: IAccountRole | IAccountRole[],
): Promise<IAccountDB> {
  const session = await getSession(request.headers.get("Cookie"));
  const authID = session.get("auth_id");

  if (!authID) {
    throw new ClientError("Not Authorized", { statusCode: 401 });
  }

  const account = await runTransaction(async (transaction) => {
    const result = await selectAccountAuth(transaction, {
      auth_id: authID,
    });

    if (!result) {
      await destroySession(session);

      throw new ClientError("Not Found", { statusCode: 404 });
    }

    const [account] = await selectAccountEntities(transaction, [result.id]);

    return account;
  });

  // @TODO proper error handling
  if (allowedRoles) {
    const isValidRole =
      typeof allowedRoles === "string"
        ? account.role === allowedRoles
        : allowedRoles.includes(account.role);

    if (!isValidRole) {
      throw new ClientError("Not Found", { statusCode: 404 });
    }
  }

  return account;
}

export async function authenticateAdmin(request: Request) {
  const account = await authenticateRequest(request, "administrator");

  return account;
}
