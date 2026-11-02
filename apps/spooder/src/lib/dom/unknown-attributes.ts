import type { IMaybe } from "@repo/ui/types";
import { collectAttributes } from "./collect-attributes";
import type { IElementAttributeMapping } from "./types";

export function collectUnknownElementAttributes(
  element: HTMLElement,
  knownAttributeNames?: ReadonlySet<string>,
): IMaybe<IElementAttributeMapping> {
  return collectAttributes(element, knownAttributeNames);
}
