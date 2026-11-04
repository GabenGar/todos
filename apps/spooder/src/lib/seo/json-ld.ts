import type { IMaybe, IOneOrMany } from "@repo/ui/types";
import { isObject } from "@repo/ui/objects";

interface IResult {
  items?: IOneOrMany<unknown>;
  unknownItems?: IOneOrMany<unknown>;
  invalidItems?: IOneOrMany<string>;
}

export function collectJSONLD(): IMaybe<IResult> {
  const elements = document.querySelectorAll<HTMLScriptElement>(
    `script[type="application/ld+json"]`,
  );
  const items: unknown[] = [];
  const unknownItems: unknown[] = [];
  const invalidItems: string[] = [];

  for (const element of elements) {
    const content = element.textContent.trim();

    let parsedContent: unknown;
    try {
      parsedContent = JSON.parse(content);
    } catch (_error) {
      invalidItems.push(content);
      continue;
    }

    if (!isValidJSONLD(parsedContent)) {
      invalidItems.push(content);
      continue;
    }

    if (!isKnownJSONLD(parsedContent)) {
      unknownItems.push(parsedContent);
      continue;
    }

    items.push(parsedContent);
  }

  const result: IResult = {};

  if (items.length !== 0) {
    if (items.length === 1) {
      result.items = items[0];
    } else {
      result.items = items;
    }
  }

  if (unknownItems.length !== 0) {
    if (unknownItems.length === 1) {
      result.unknownItems = unknownItems[0];
    } else {
      result.unknownItems = unknownItems;
    }
  }

  if (invalidItems.length !== 0) {
    if (invalidItems.length === 1) {
      result.invalidItems = invalidItems[0];
    } else {
      result.invalidItems = invalidItems;
    }
  }

  return Object.keys(result).length === 0 ? undefined : result;
}

function isValidJSONLD(input: unknown): input is object {
  return isObject(input);
}

function isKnownJSONLD(input: unknown): boolean {
  return false;
}
