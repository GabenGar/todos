import { getQueryFile, type ITransaction } from "#database";
import type { IAccountLogin } from "#entities/account";
import type { IAccountDBAuthData } from "./types";

const query = getQueryFile("accounts", "auth.sql");

export async function selectAccountAuth(
  transaction: ITransaction,
  login: IAccountLogin["login"]
) {
  const params = {
    login,
  };

  const auth = await transaction.one<IAccountDBAuthData>(query, params);

  return auth;
}
