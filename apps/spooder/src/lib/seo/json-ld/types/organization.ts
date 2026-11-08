import type { IValidJSONLD } from "../types";

export interface IOrganizationJSONLD extends IValidJSONLD {
  "@type": "Organization";
  name?: string;
  alternateName?: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}