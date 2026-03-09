import { useTranslation } from "react-i18next";
import type { IPageNamespace } from "#lib/internationalization";

export function usePageTranslation(pageNamespace: IPageNamespace) {
  return useTranslation(pageNamespace);
}
