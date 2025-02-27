export interface IServerConfiguration {
  server: {
    port: number;
    secret_key: string;
  };
  database: {
    user: string;
    host: string;
    port: number;
    database: string;
    password?: string;
  };
}
