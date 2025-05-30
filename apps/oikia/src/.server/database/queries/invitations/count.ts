import {
  getQueryFile,
  type ICount,
  type ICountResult,
  type ITransaction,
} from "#database";
import type { IInvitation } from "#entities/account";

const query = getQueryFile("invitations", "count.sql");

interface IFilter {
  code?: IInvitation["code"];
}

export async function selectInvitationCount(
  transaction: ITransaction,
  filter?: IFilter
): Promise<ICount> {
  const params = {
    code: filter?.code
  };

  const { count } = await transaction.one<ICountResult>(query, params);

  return count;
}
