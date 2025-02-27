import { genSalt, hash as hashPassword, truncates } from "bcryptjs";
import type { ITransaction } from "#database";
import {
  insertAccounts,
  selectAccountEntities,
  type IAccountDBInit,
} from "#database/queries/accounts";
import type { IAccount, IAccountInit } from "#entities/account";

export async function registerAccount(
  transaction: ITransaction,
  init: IAccountInit
): Promise<IAccount> {
  const { password } = init;

  if (truncates(password)) {
    throw new Error("Invalid password length.");
  }

  const salt = await genSalt(10);
  const hashedPassword = await hashPassword(password, salt);
  const realInit: IAccountDBInit = {
    ...init,
    role: "user",
    password: hashedPassword,
  };

  const [id] = await insertAccounts(transaction, [realInit]);
  const [accountDB] = await selectAccountEntities(transaction, [id]);
  const account: IAccount = {
    role: accountDB.role
  }

  return account;
}
