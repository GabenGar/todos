export interface IServerConfiguration {
  server: {
    port: number;
  };
  database: {
    user: string;
    host: string;
    port: number;
    database: string;
    password?: string;
  };
}
