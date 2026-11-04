import { mergeSets } from "@repo/ui/sets";
import { openGraphMetaNames } from "./opengraph";
import { twitterMetaNames } from "./twitter";

const baseWHATWGMetaNames = new Set([
  "creator",
  "googlebot",
  "publisher",
  "robots",
] as const);

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name#meta_names_defined_in_the_whatwg_metaextensions_wiki
 *
 * https://wiki.whatwg.org/wiki/MetaExtensions
 */
export const whatwgMetaNames = mergeSets(
  baseWHATWGMetaNames,
  openGraphMetaNames,
  twitterMetaNames
);
