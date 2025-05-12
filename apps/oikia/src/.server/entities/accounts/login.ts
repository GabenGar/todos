import { compare as comparePassword } from "bcryptjs";
import type { ITransaction } from "#database";
import {
  selectAccountAuth,
  type IAccountDBAuthData,
} from "#database/queries/accounts";
import type { IAccountLogin } from "#entities/account";

export async function loginAccount(
  transaction: ITransaction,
  data: IAccountLogin,
): Promise<IAccountDBAuthData> {
  const { login, password } = data;
  const accountAuth = await selectAccountAuth(transaction, { login });
  const hashedPassword = accountAuth.password;
  const isMatching = await comparePassword(password, hashedPassword);

  if (!isMatching) {
    throw new Error("Account with this login and password doesn't exist.");
  }

  return accountAuth;
}
