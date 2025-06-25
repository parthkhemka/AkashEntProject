/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_STORAGE_ACCOUNT_NAME: string;
  readonly VITE_AZURE_STORAGE_CONTAINER_NAME: string;
  readonly VITE_AZURE_STORAGE_SAS_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
