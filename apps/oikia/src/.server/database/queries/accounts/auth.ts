import { getQueryFile, type ITransaction } from "#database";
import type { IAccountLogin } from "#entities/account";
import type { IAccountDBAuthData } from "./types";

const query = getQueryFile("accounts", "auth.sql");

interface IFilter {
  login?: IAccountLogin["login"];
  auth_id?: IAccountDBAuthData["auth_id"];
}

export async function selectAccountAuth(
  transaction: ITransaction,
  filter: IFilter,
) {
  if (!filter.login && !filter.auth_id) {
    throw new Error("Login or auth ID is required by neither was provided.");
  }

  const params = {
    login: filter.login,
    auth_id: filter.auth_id,
  };

  const auth = await transaction.oneOrNone<IAccountDBAuthData>(query, params);

  return auth;
}
