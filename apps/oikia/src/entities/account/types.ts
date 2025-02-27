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

export interface IAccount {
  role: IAccountRole;
}

export type IAccountRole = "user"
