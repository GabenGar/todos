import type { IElementType } from "@repo/ui/types";

export const openGraphMetaNames = new Set([
  "og:type",
  "og:site_name",
  "og:url",
  "og:title",
  "og:description",
  "og:image",
] as const);

type IOpenGraphMetaName = IElementType<typeof openGraphMetaNames>;

export function isOpenGraphMetaName(
  input: unknown,
): input is IOpenGraphMetaName {
  return openGraphMetaNames.has(input as IOpenGraphMetaName);
}

export function isOpenGraphElement(element: HTMLMetaElement) {
  const name = element.getAttribute("name")
  const property = element.getAttribute("property")

  if (name?.startsWith("og:") || property?.startsWith("og:")) {
    return true
  }

  return false
}