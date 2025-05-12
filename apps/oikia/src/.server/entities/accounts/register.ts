import { genSalt, hash as hashPassword, truncates } from "bcryptjs";
import { BIGINT_ZERO } from "#lib/numbers/bigint";
import { ADMIN_INVITATION_CODE } from "#server/environment";
import type { ITransaction } from "#database";
import {
  insertAccounts,
  selectAccountCount,
  selectAccountEntities,
  type IAccountDBInit,
} from "#database/queries/accounts";
import type { IAccount, IAccountInit } from "#entities/account";

export async function registerAccount(
  transaction: ITransaction,
  init: IAccountInit,
): Promise<IAccount> {
  const { password } = init;

  if (truncates(password)) {
    throw new Error("Invalid password length.");
  }

  const isAdminInvitation = init.invitation_code === ADMIN_INVITATION_CODE;

  if (isAdminInvitation) {
    const resultCount = await selectAccountCount(transaction, {
      role: "administrator",
    });

    const adminCount = BigInt(resultCount);

    if (adminCount !== BIGINT_ZERO) {
      throw new Error("Invalid invitation code.");
    }
  }

  const salt = await genSalt(10);
  const hashedPassword = await hashPassword(password, salt);
  const realInit: IAccountDBInit = {
    ...init,
    role: isAdminInvitation ? "administrator" : "user",
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
