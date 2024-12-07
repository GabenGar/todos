export interface IWebExtConfig {
  verbose?: boolean
  sourceDir: string;
  artifactsDir: string;
  ignoreFiles: string[];
  run: {
    startUrl: string[]
    pref?: string[]
  };
  build: {
    overwriteDest: boolean;
  };
}
