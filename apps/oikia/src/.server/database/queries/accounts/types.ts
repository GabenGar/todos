import type { IAccount, IAccountInit, IAccountLogin } from "#entities/account";

export interface IAccountDB extends IAccount {
  id: string;
}

export interface IAccountDBInit extends IAccountInit, Pick<IAccount, "role"> {}

export interface IAccountDBAuthData
  extends IAccountLogin,
    Pick<IAccountDB, "id"> {}
