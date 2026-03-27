/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SITE_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Server-side environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: "development" | "production";
    }
  }
}

export {};
