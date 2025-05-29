import type { IAccountDB } from "#database/queries/accounts";

export interface IAccountInit {
  login: string;
  password: string;
  invitation_code: string;
  name?: string;
}

export interface IAccountLogin {
  login: string;
  password: string;
}

export interface IAccount extends Pick<IAccountInit, "name"> {
  created_at: string;
  role: IAccountRole;
  invited_through?: IInvitationItem;
}

export type IAccountRole = "user" | "administrator";

export interface IInvitation {
  code: string;
  created_at: string;
  updated_at: string;
  created_by?: IAccountDB["id"];
  expires_at?: string;
  max_uses?: string;
  is_active: boolean;
  title?: string;
  description?: string;
}

export interface IInvitationItem extends Pick<IInvitation, "code" | "title"> {}
