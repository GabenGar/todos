import type { IElementType, IOneOrMany } from "@repo/ui/types";

const knownJSONLDTypes = new Set([
  "Organization",
  "SoftwareApplication",
  "FAQPage",
  "WebSite",
] satisfies IKnownJSONLD["@type"][]);

type IKnownJSONLDType = IElementType<typeof knownJSONLDTypes>;

export type IJSONLD = IKnownJSONLD & {
  unknownKeys?: Map<string, IOneOrMany<unknown>>;
};

export type IKnownJSONLD =
  | IOrganizationJSONLD
  | ISoftwareApplicationJSONLD
  | IFAQPageJSONLD
  | IWebSiteJSONLD;

export interface IOrganizationJSONLD extends IValidJSONLD {
  "@type": "Organization";
  name?: string;
  alternateName?: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

export interface ISoftwareApplicationJSONLD extends IValidJSONLD {
  "@type": "SoftwareApplication";
  name?: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  description: string;
}

export interface IFAQPageJSONLD extends IValidJSONLD {
  "@type": "FAQPage";
  mainEntity?: {
    "@type": "Question";
    name?: string;
    acceptedAnswer?: {
      "@type": "Answer";
      text?: string;
    };
  }[];
}

export interface IWebSiteJSONLD extends IValidJSONLD {
  "@type": "WebSite";
  name?: string;
  publisher?: {
    "@id"?: string;
  };
  url?: string;
  potentialAction?: {
    "@type": "SearchAction";
    "query-input"?: string;
    target?: {
      "@type"?: "EntryPoint";
      urlTemplate?: string;
    };
  };
}

export interface IValidJSONLD {
  "@context": string;
  "@type": string;
  "@id"?: string;
}

export function isKnownJSONLDType(input: unknown): input is IKnownJSONLDType {
  return knownJSONLDTypes.has(input as IKnownJSONLDType);
}

export interface IJSONLDMeta {
  items?: IOneOrMany<IJSONLD>;
  unknownItems?: IOneOrMany<IValidJSONLD>;
  invalidItems?: IOneOrMany<string>;
}
