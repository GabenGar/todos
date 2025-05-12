import {
  getQueryFile,
  type ICount,
  type ICountResult,
  type ITransaction,
} from "#database";
import type { IAccountRole } from "#entities/account";

const query = getQueryFile("accounts", "count.sql");

interface IFilter {
  role?: IAccountRole;
}

export async function selectAccountCount(
  transaction: ITransaction,
  filter?: IFilter,
): Promise<ICount> {
  const params = {
    role: filter?.role,
  };

  const { count } = await transaction.one<ICountResult>(query, params);

  return count;
}
