import { collectUnknownObjectKeys } from "@repo/ui/objects";
import { mergeSets } from "@repo/ui/sets";
import type {
  IFAQPageJSONLD,
  IJSONLD,
  IKnownJSONLD,
  IOrganizationJSONLD,
  ISoftwareApplicationJSONLD,
  IValidJSONLD,
  IWebSiteJSONLD,
} from "./types";

const baseKnownKeys = new Set([
  "@context",
  "@type",
  "@id",
] satisfies (keyof IValidJSONLD)[]);
const organizationKeys = mergeSets(
  baseKnownKeys,
  new Set([
    "name",
    "alternateName",
    "url",
    "logo",
    "sameAs",
    "description",
  ] satisfies (keyof IOrganizationJSONLD)[]),
);
const websiteKeys = mergeSets(
  baseKnownKeys,
  new Set([
    "name",
    "potentialAction",
    "publisher",
    "url",
  ] satisfies (keyof IWebSiteJSONLD)[]),
);
const softwareApplicationKeys = mergeSets(
  baseKnownKeys,
  new Set([
    "applicationCategory",
    "description",
    "name",
    "url",
    "operatingSystem",
  ] satisfies (keyof ISoftwareApplicationJSONLD)[]),
);
const faqPageKeys = mergeSets(
  baseKnownKeys,
  new Set(["mainEntity"] satisfies (keyof IFAQPageJSONLD)[]),
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

    default: {
      throw new Error(`Unknown JSON-LD type "${type satisfies never}"`);
    }
  }

  return !unknownKeys ? input : { ...input, unknownKeys };
}
