interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  // readonly VITE_APP_TITLE: string
  readonly VITE_IS_TRANSLATION_DEBUG_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}