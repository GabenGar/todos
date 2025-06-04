import {
  getQueryFile,
  type ICount,
  type ICountResult,
  type ITransaction,
} from "#database";
import type { IInvitation } from "#entities/account";

const query = getQueryFile("invitations", "count.sql");

interface IFilter
  extends Pick<
    Partial<IInvitation>,
    "code" | "target_role" | "is_active" | "expires_at"
  > {}

export async function selectInvitationCount(
  transaction: ITransaction,
  filter?: IFilter
): Promise<ICount> {
  const params = {
    code: filter?.code,
    target_role: filter?.target_role,
    is_active: filter?.is_active,
    expires_at: filter?.expires_at,
  };

  const { count } = await transaction.one<ICountResult>(query, params);

  return count;
}
