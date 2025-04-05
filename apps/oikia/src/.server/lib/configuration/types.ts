export interface IServerConfiguration {
  server: {
    port: number;
    secret_key: string;
    admin_invitation_code: string;
  };
  database: {
    user: string;
    host: string;
    port: number;
    database: string;
    password?: string;
  };
}
