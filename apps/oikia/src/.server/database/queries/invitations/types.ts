import type { IInvitation } from "#entities/account";
import type { IAccountDBItem } from "#database/queries/accounts";

export interface IInvitationDB extends Omit<IInvitation, "created_by"> {
  id: string;
  created_by?: IAccountDBItem;
}

export interface IInvitationDBItem
  extends Pick<IInvitationDB, "id" | "code" | "title"> {}

export interface IInvitationDBInit
  extends Pick<
    IInvitation,
    | "created_by"
    | "code"
    | "target_role"
    | "expires_at"
    | "max_uses"
    | "title"
    | "description"
  > {}
