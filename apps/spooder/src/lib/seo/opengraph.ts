import type { IElementType } from "@repo/ui/types";
import { collectUnknownElementAttributes } from "#lib/dom";
import type { IOpenGraph, IOpenGraphMetaTag } from "./types";

export const openGraphMetaNames = new Set([
  "og:type",
  "og:site_name",
  "og:url",
  "og:title",
  "og:description",
  "og:image",
  "og:locale",
  "og:image:type",
  "og:image:width",
  "og:image:height",
  "og:image:alt"
] as const);

type IOpenGraphMetaName = IElementType<typeof openGraphMetaNames>;

export function isOpenGraphMetaName(
  input: unknown,
): input is IOpenGraphMetaName {
  return openGraphMetaNames.has(input as IOpenGraphMetaName);
}

export function isOpenGraphElement(element: HTMLMetaElement) {
  const name = element.getAttribute("name");
  const property = element.getAttribute("property");

  if (name?.startsWith("og:") || property?.startsWith("og:")) {
    return true;
  }

  return false;
}

const openGraphAttributes = new Set(["name", "property", "content"] as const);

export function collectOpenGraphElement(
  openGraph: IOpenGraph,
  element: HTMLMetaElement,
) {
  const name = element.getAttribute("name") ?? undefined;
  const property = element.getAttribute("property") ?? undefined;
  const content = element.getAttribute("content") ?? undefined;
  const unknownAttributes = collectUnknownElementAttributes(
    element,
    openGraphAttributes,
  );
  const tag: IOpenGraphMetaTag = {};

  if (name) {
    tag.name = name;
  }

  if (property) {
    tag.property = property;
  }

  if (content) {
    tag.content = content;
  }

  if (unknownAttributes?.size !== 0) {
    tag.unknownAttributes = unknownAttributes;
  }

  const resolvedName = property || name;

  if (!isOpenGraphMetaName(resolvedName)) {
    if (!openGraph.unknownTags) {
      openGraph.unknownTags = [tag];
    } else {
      openGraph.unknownTags.push(tag);
    }

    return;
  }

  switch (resolvedName) {
    case "og:url": {
      openGraph.url = content;
      break;
    }

    case "og:type": {
      openGraph.type = content;
      break;
    }

    case "og:site_name": {
      openGraph.siteName = content;
      break;
    }

    case "og:title": {
      openGraph.title = content;
      break;
    }

    case "og:description": {
      openGraph.description = content;
      break;
    }

    case "og:image": 
    case "og:image:type":
    case "og:image:width":
    case "og:image:height":
    case "og:image:alt": {
      if (!openGraph.image) {
        openGraph.image = {}
      }

      switch (resolvedName) {
        case "og:image":  {
          openGraph.image.url = content
          break
        }
        case "og:image:type": {
          openGraph.image.type = content
          break
        }
        case "og:image:width": {
          openGraph.image.width = content
          break
        }
        case "og:image:height": {
          openGraph.image.height = content
          break
        }
        case "og:image:alt": {
          openGraph.image.alt = content
          break
        }
      
        default: {
          break;
        }
          
      }

      break
    }


    case "og:locale": {
      openGraph.locale = content;
      break;
    }

    default: {
      if (!openGraph.unknownTags) {
        openGraph.unknownTags = [tag];
      } else {
        openGraph.unknownTags.push(tag);
      }
      break;
    }
  }
}
