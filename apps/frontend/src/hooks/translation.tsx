import { useTranslation as useBaseTranslation } from "react-i18next";
import type {
  IDefaultNamespace,
  IPageNamespace,
} from "#lib/internationalization";

export function useTranslation<DefaultNamespace extends IDefaultNamespace>(
  namespace: DefaultNamespace,
) {
  return useBaseTranslation<DefaultNamespace>(namespace);
}
export function usePageTranslation<PageNamespace extends IPageNamespace>(
  pageNamespace: PageNamespace,
) {
  return useBaseTranslation<PageNamespace>(pageNamespace);
}
