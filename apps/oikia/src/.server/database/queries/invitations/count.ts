import {
  getQueryFile,
  type ICount,
  type ICountResult,
  type ITransaction,
} from "#database";

const query = getQueryFile("invitations", "count.sql");

export async function selectInvitationCount(
  transaction: ITransaction,
): Promise<ICount> {
  const params = {
  };

  const { count } = await transaction.one<ICountResult>(query, params);

  return count;
}
