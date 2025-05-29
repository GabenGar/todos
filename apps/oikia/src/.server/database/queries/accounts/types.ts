import type { IAccount, IAccountInit, IAccountLogin } from "#entities/account";
import type { IInvitationDBItem } from "#database/queries/invitations";

export interface IAccountDBInit extends IAccountInit, Pick<IAccount, "role"> {}

export interface IAccountDBAuthData
  extends IAccountLogin,
    Pick<IAccountDB, "id"> {
  auth_id: string;
}

export interface IAccountDB extends Omit<IAccount, "invited_through"> {
  id: string;
  invited_through?: IInvitationDBItem;
}

export interface IAccountDBItem extends Pick<IAccountDB, "id" | "name"> {}
