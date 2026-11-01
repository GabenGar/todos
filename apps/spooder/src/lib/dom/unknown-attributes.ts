import type { IMaybe } from "@repo/ui/types";
import type { IElementAttributeMapping } from "./types";

export function collectUnknownElementAttributes(
  element: HTMLElement,
  knownAttributeNames?: ReadonlySet<string>,
): IMaybe<IElementAttributeMapping> {
  const mapping: IElementAttributeMapping = new Map();

  for (const attribute of element.attributes) {
    const name = attribute.name;

    if (knownAttributeNames?.has(name)) {
      continue;
    }

    const value = attribute.value;

    if (!mapping.has(name)) {
      mapping.set(name, value);
      continue;
    }

    // biome-ignore lint/style/noNonNullAssertion: it just works
    const oldValue = mapping.get(name)!;

    if (Array.isArray(oldValue)) {
      oldValue.push(value);
      continue;
    }

    mapping.set(name, [oldValue, value]);
  }

  return mapping;
}
