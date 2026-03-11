import { useTranslation as useBaseTranslation} from "react-i18next";

export function useTranslation() {
  return useBaseTranslation("@repo/ui")
}