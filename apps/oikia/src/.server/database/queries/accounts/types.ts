import type { IAccount, IAccountInit } from "#entities/account";

export interface IAccountDB extends IAccount {
  id: string;
}

export interface IAccountDBInit extends IAccountInit {
  role: "user";
}
