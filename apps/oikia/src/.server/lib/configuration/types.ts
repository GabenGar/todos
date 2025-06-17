export interface IServerConfiguration {
  server: {
    port: number;
    secret_key: string;
  };
  database: {
    migrations: {
      user: string;
      host: string;
      port: number;
      database: string;
      password?: string;
    };
    administrator: {
      user: string;
      host: string;
      port: number;
      database: string;
      password?: string;
    };
  };
}
