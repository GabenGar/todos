interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_SITE_TITLE: string;
  readonly VITE_SUPPORTED_LANGUAGES: string;
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_SOURCE_CODE_URL: string;
  readonly VITE_IS_TRANSLATION_DEBUG_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
