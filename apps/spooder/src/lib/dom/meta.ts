import { isKnownMetaName } from "#lib/seo";

interface IResult {
  known: HTMLMetaElement[];
  unknown: HTMLMetaElement[];
}

export function selectMetaElements(): IResult {
  const metaElements = document.querySelectorAll("meta");
  const known: HTMLMetaElement[] = [];
  const unknown: HTMLMetaElement[] = [];

  for (const element of metaElements) {
    const name = element.getAttribute("name");

    if (name === null || !isKnownMetaName(name)) {
      unknown.push(element);
      continue;
    }

    known.push(element);
  }

  const result: IResult = {
    known,
    unknown,
  };

  return result;
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta
 */
export function isValidMetaElement(element: HTMLMetaElement): boolean {
  const isDocumentLevelMetadata = element.hasAttribute("name");
  const isPragmaDirective = element.hasAttribute("http-equiv");
  const isCharsetDeclaration = element.hasAttribute("charset");
  const isUserDefinedMetadata = element.hasAttribute("itemprop");

  // The itemprop attribute must not be set on a `<meta>` element
  // that includes a `name`, `http-equiv`, or `charset` attribute.
  if (
    isUserDefinedMetadata &&
    (isDocumentLevelMetadata || isPragmaDirective || isCharsetDeclaration)
  ) {
    return false;
  }

  if (isCharsetDeclaration) {
    const value = element.getAttribute("charset");

    return value?.toLowerCase() === "utf-8";
 }

  if (isDocumentLevelMetadata || isPragmaDirective) {
    if (!element.hasAttribute("content")) {
      return false;
    }

    return true
  }

  return false;
}
