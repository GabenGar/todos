import { genSalt, hash as hashPassword, truncates } from "bcryptjs";
import { isBefore } from "date-fns";
import { BIGINT_ONE, BIGINT_ZERO } from "@repo/ui/numbers/bigint";
import { createPagination } from "@repo/ui/pagination";
import { now } from "@repo/ui/dates";
import type { ITransaction } from "#database";
import {
  insertAccounts,
  selectAccountCount,
  selectAccountEntities,
  type IAccountDBInit,
} from "#database/queries/accounts";
import {
  selectInvitationCount,
  selectInvitationEntities,
  selectInvitationIDs,
  type IInvitationDB,
} from "#database/queries/invitations";
import { ClientError } from "#server/lib/errors";
import type { IAccount, IAccountInit, IInvitation } from "#entities/account";

export async function registerAccount(
  transaction: ITransaction,
  init: IAccountInit,
): Promise<IAccount> {
  const { password } = init;

  if (truncates(password)) {
    throw new ClientError("Invalid password length.");
  }

  let invitation: IInvitationDB;

  try {
    invitation = await parseInvitation(transaction, init.invitation_code);
  } catch (error) {
    throw new ClientError("Invalid invitation or it doesn't exist.", {
      cause: error,
    });
  }

  const role = invitation.target_role;
  const isAdminInvitation = role === "administrator";

  // only allow a single admin
  if (isAdminInvitation) {
    const resultCount = await selectAccountCount(transaction, {
      role: "administrator",
    });

    const adminCount = BigInt(resultCount);

    if (adminCount !== BIGINT_ZERO) {
      throw new ClientError("Invalid invitation or it doesn't exist.");
    }
  }

  const salt = await genSalt(10);
  const hashedPassword = await hashPassword(password, salt);
  const realInit: IAccountDBInit = {
    ...init,
    role,
    password: hashedPassword,
  };

  const [id] = await insertAccounts(transaction, [realInit]);
  const [accountDB] = await selectAccountEntities(transaction, [id]);
  const account: IAccount = {
    created_at: accountDB.created_at,
    role: accountDB.role,
    name: accountDB.name,
  };

  return account;
}

async function parseInvitation(
  transaction: ITransaction,
  code: IInvitation["code"],
): Promise<IInvitationDB> {
  const count = await selectInvitationCount(transaction, { code });
  const parsedCount = BigInt(count);

  if (parsedCount !== BIGINT_ONE) {
    const message =
      parsedCount === BIGINT_ZERO
        ? "Invitation doesn't exist."
        : `Found more than one invitation for code "${code}".`;

    throw new Error(message);
  }

  const pagination = createPagination(count);
  const result = await selectInvitationIDs(transaction, { pagination, code });
  const [invitation] = await selectInvitationEntities(transaction, result);
  const { id, is_active, title, expires_at } = invitation;
  const fancyTitle = `${title ? `"${title}"` : "Untitled"} (${id})`;

  if (!is_active) {
    throw new Error(`Invitation ${fancyTitle} is inactive.`);
  }

  if (expires_at) {
    const isValid = isBefore(expires_at, now());

    if (!isValid) {
      throw new Error(`Invitation ${fancyTitle} is expired.`);
    }
  }

  if (invitation.max_uses) {
    const parsedMax = BigInt(invitation.max_uses);
    // biome-ignore lint/style/noNonNullAssertion: just correlated values things
    const parsedCurrent = BigInt(invitation.current_uses!);

    if (parsedCurrent >= parsedMax) {
      throw new Error(`Invitation ${fancyTitle} ran out of uses.`);
    }
  }

  return invitation;
}
