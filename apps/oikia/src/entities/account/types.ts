export interface IAccountInit {
  login: string;
  password: string;
  invitation: string;
  name?: string;
}

export interface IAccountLogin {
  login: string;
  password: string;
}
