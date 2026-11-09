import { collectUnknownObjectKeys } from "@repo/ui/objects";
import { mergeSets } from "@repo/ui/sets";
import type { IJSONLD, IKnownJSONLD, IValidJSONLD } from "./types";
import type { IArticleJSONLD } from "./types/article";
import type { IFAQPageJSONLD } from "./types/faq-page";
import type { IOrganizationJSONLD } from "./types/organization";
import type { IProfilePageJSONLD } from "./types/profile-page";
import type { ISoftwareApplicationJSONLD } from "./types/software-application";
import type { IWebSiteJSONLD } from "./types/web-site";
import type { IWebPageJSONLD } from "./types/web-page";

const baseKnownKeys = new Set<keyof IValidJSONLD>(["@context", "@type", "@id"]);
const organizationKeys = mergeSets(
  baseKnownKeys,
  new Set<keyof IOrganizationJSONLD>([
    "name",
    "alternateName",
    "url",
    "logo",
    "sameAs",
    "description",
  ]),
);
const websiteKeys = mergeSets(
  baseKnownKeys,
  new Set<keyof IWebSiteJSONLD>([
    "name",
    "potentialAction",
    "publisher",
    "url",
  ]),
);

const softwareApplicationKeys = mergeSets(
  baseKnownKeys,
  new Set<keyof ISoftwareApplicationJSONLD>([
    "applicationCategory",
    "description",
    "name",
    "url",
    "operatingSystem",
  ]),
);
const faqPageKeys = mergeSets(
  baseKnownKeys,
  new Set<keyof IFAQPageJSONLD>(["mainEntity"]),
);
const profilePageKeys = mergeSets(
  baseKnownKeys,
  new Set<keyof IProfilePageJSONLD>([
    "mainEntity",
    "dateCreated",
    "contentRating",
  ]),
);
const articlePageKeys = mergeSets(
  baseKnownKeys,
  new Set<keyof IArticleJSONLD>([
    "author",
    "dateModified",
    "datePublished",
    "headline",
    "image",
    "mainEntity",
    "name",
    "publisher",
    "sameAs",
    "url",
  ]),
);
const webPageKeys = mergeSets(
  baseKnownKeys,
  new Set<keyof IWebPageJSONLD>(["mainEntity", "url"]),
);

export function parseKnownJSONLD(input: IKnownJSONLD): IJSONLD {
  const type = input["@type"];

  let unknownKeys: IJSONLD["unknownKeys"];
  switch (type) {
    case "Organization": {
      unknownKeys = collectUnknownObjectKeys(input, organizationKeys);
      break;
    }

    case "SoftwareApplication": {
      unknownKeys = collectUnknownObjectKeys(input, softwareApplicationKeys);
      break;
    }

    case "FAQPage": {
      unknownKeys = collectUnknownObjectKeys(input, faqPageKeys);
      break;
    }

    case "WebSite": {
      unknownKeys = collectUnknownObjectKeys(input, websiteKeys);
      break;
    }

    case "ProfilePage": {
      unknownKeys = collectUnknownObjectKeys(input, profilePageKeys);
      break;
    }

    case "Article": {
      unknownKeys = collectUnknownObjectKeys(input, articlePageKeys);
      break;
    }

    case "WebPage": {
      unknownKeys = collectUnknownObjectKeys(input, webPageKeys);
      break;
    }

    default: {
      throw new Error(`Unknown JSON-LD type "${type satisfies never}"`);
    }
  }

  return !unknownKeys ? input : { ...input, unknownKeys };
}
