import type { IElementType, IOneOrMany } from "@repo/ui/types";
import type { IArticleJSONLD } from "./types/article";
import type { IFAQPageJSONLD } from "./types/faq-page";
import type { IOrganizationJSONLD } from "./types/organization";
import type { IProfilePageJSONLD } from "./types/profile-page";
import type { ISoftwareApplicationJSONLD } from "./types/software-application";
import type { IVideoObjectJSONLD } from "./types/video-object";
import type { IWebPageJSONLD } from "./types/web-page";
import type { IWebSiteJSONLD } from "./types/web-site";

const knownJSONLDTypes = new Set([
  "Organization",
  "SoftwareApplication",
  "FAQPage",
  "WebSite",
  "ProfilePage",
  "Article",
  "WebPage",
  "VideoObject",
] satisfies IKnownJSONLD["@type"][]);

type IKnownJSONLDType = IElementType<typeof knownJSONLDTypes>;

export type IJSONLD = IKnownJSONLD & {
  unknownKeys?: Map<string, IOneOrMany<unknown>>;
};

export type IKnownJSONLD =
  | IOrganizationJSONLD
  | ISoftwareApplicationJSONLD
  | IFAQPageJSONLD
  | IWebSiteJSONLD
  | IProfilePageJSONLD
  | IArticleJSONLD
  | IWebPageJSONLD
  | IVideoObjectJSONLD;

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
