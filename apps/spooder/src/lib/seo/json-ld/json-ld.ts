import { isObject } from "@repo/ui/objects";
import type { IMaybe } from "@repo/ui/types";
import {
  type IJSONLD,
  type IJSONLDMeta,
  type IKnownJSONLD,
  type IValidJSONLD,
  isKnownJSONLDType,
} from "./types";
import { parseKnownJSONLD } from "./parse";

export function collectJSONLD(): IMaybe<IJSONLDMeta> {
  const elements = document.querySelectorAll<HTMLScriptElement>(
    `script[type="application/ld+json"]`,
  );
  const items: IJSONLD[] = [];
  const unknownItems: IValidJSONLD[] = [];
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

    const jsonLD = parseKnownJSONLD(parsedContent);

    items.push(jsonLD);
  }

  const result: IJSONLDMeta = {};

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

function isValidJSONLD(input: unknown): input is IValidJSONLD {
  return (
    isObject(input) &&
    !Array.isArray(input) &&
    "@context" in input &&
    typeof input["@context"] === "string" &&
    "@type" in input &&
    typeof input["@type"] === "string"
  );
}

function isKnownJSONLD(input: IValidJSONLD): input is IKnownJSONLD {
  return isKnownJSONLDType(input["@type"]);
}


