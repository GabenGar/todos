import type { IElementType } from "@repo/ui/types";
import { collectUnknownElementAttributes } from "#lib/dom";
import {
  type ITwitterMetaTag,
  type ITwitterTags,
  knownMetaAttributes,
} from "./types";

export const twitterMetaNames = new Set([
  "twitter:site",
  "twitter:site:id",
  "twitter:creator",
  "twitter:title",
  "twitter:description",
  "twitter:image",
  "twitter:image:alt",
  "twitter:card",
  "twitter:url",
] as const);

type ITwitterMetaName = IElementType<typeof twitterMetaNames>;

export function isTwitterMetaName(input: unknown): input is ITwitterMetaName {
  return twitterMetaNames.has(input as ITwitterMetaName);
}

export function isTwitterElement(element: HTMLMetaElement) {
  const name = element.getAttribute("name");

  if (name?.startsWith("twitter:")) {
    return true;
  }

  return false;
}

export function collectTwitterElement(
  twitter: ITwitterTags,
  element: HTMLMetaElement,
) {
  const name = element.getAttribute("name") ?? undefined;
  const content = element.getAttribute("content") ?? undefined;
  const unknownAttributes = collectUnknownElementAttributes(
    element,
    knownMetaAttributes,
  );
  const tag: ITwitterMetaTag = {};

  if (name) {
    tag.name = name;
  }

  if (content) {
    tag.content = content;
  }

  if (unknownAttributes && unknownAttributes.size !== 0) {
    tag.unknownAttributes = unknownAttributes;
  }

  if (!isTwitterMetaName(name)) {
    if (!twitter.unknownTags) {
      twitter.unknownTags = [];
    }

    twitter.unknownTags.push(tag);

    return;
  }

  switch (name) {
    case "twitter:site":
    case "twitter:site:id": {
      if (!twitter.site) {
        twitter.site = {};
      }

      switch (name) {
        case "twitter:site": {
          twitter.site.url = content;
          break;
        }
        case "twitter:site:id": {
          twitter.site.id = content;
          break;
        }
      }
      break;
    }

    case "twitter:title": {
      twitter.title = content;
      break;
    }

    case "twitter:description": {
      twitter.description = content;
      break;
    }

    case "twitter:creator": {
      twitter.creator = content;
      break;
    }

    case "twitter:card": {
      twitter.card = content;
      break;
    }

    case "twitter:image":
    case "twitter:image:alt": {
      if (!twitter.image) {
        twitter.image = {};
      }

      switch (name) {
        case "twitter:image": {
          twitter.image.url = content;
          break;
        }

        case "twitter:image:alt": {
          twitter.image.alt = content;
          break;
        }

        default: {
          throw new Error(
            `Unknown twitter meta tag name "${name satisfies never}".`,
          );
        }
      }
      break;
    }

    default: {
      if (!twitter.unknownTags) {
        twitter.unknownTags = [];
      }

      twitter.unknownTags.push(tag);

      break;
    }
  }
}
