import { mergeSets } from "@repo/ui/sets";
import type { IElementType } from "@repo/ui/types";
import { whatwgMetaNames } from "./whatwg";

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name#meta_names_defined_in_the_html_specification
 */
const htmlMetaNames = new Set([
  /**
   * A short and accurate summary of the content of the page usually referred to as a "meta description". Search engines like Google use this metadata to adjust the appearance of a webpage in search results.
   */
  "description",
  /**
   * Browsers may use this to identify the application running in the web page. It is different from the `<title>` element, which may contain an application (or website) name, but a `<title>` may add contextual information like a document name or a status. Individual pages shouldn't define their own, unique `application-name`. To provide translations, use multiple `<meta>` tags with the `lang` attribute for each language:
   */
  "application-name",
  /**
   * The document author's name.
   */
  "author",
  "color-scheme",
  "generator",
  "keywords",
  "referrer",
  "theme-color",
  "text-scale",
  "viewport",
] as const);

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name#meta_names_defined_in_other_specifications
 */
const otherMetaNames = new Set([
  "responsive-embedded-sizing",
  "text-scale",
  "viewport",
] as const);

const knownMetaNames = mergeSets(
  htmlMetaNames,
  otherMetaNames,
  whatwgMetaNames,
);

export type IKnownMetaName = IElementType<typeof knownMetaNames>;

export function isKnownMetaName(input: unknown): input is IKnownMetaName {
  return knownMetaNames.has(input as IKnownMetaName);
}