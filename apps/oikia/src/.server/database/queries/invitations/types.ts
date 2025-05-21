import type { IInvitation } from "#entities/account";

export interface IInvitationDB extends IInvitation {
  id: string;
}

export interface IInvitationDBInit
  extends Pick<
    IInvitation,
    | "created_by"
    | "code"
    | "expires_at"
    | "max_uses"
    | "is_active"
    | "title"
    | "description"
  > {}
