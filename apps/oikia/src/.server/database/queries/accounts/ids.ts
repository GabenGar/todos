import type { IPagination } from "#lib/pagination";
import {
  getQueryFile,
  toEntityIDs,
  type IEntityRow,
  type ITransaction,
} from "#database";
import type { IAccountRole } from "#entities/account";
import type { IAccountDB } from "./types";

const query = getQueryFile("accounts", "ids.sql");

interface IFilter {
  role?: IAccountRole;
  pagination: IPagination;
}

export async function selectAccountIDs(
  transaction: ITransaction,
  filter: IFilter,
): Promise<IAccountDB["id"][]> {
  const { limit, offset } = filter.pagination;
  const params = {
    role: filter?.role,
    offset,
    limit,
  };
  const result = await transaction.many<IEntityRow>(query, params);
  const ids = toEntityIDs(result);

  return ids;
}
