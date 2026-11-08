import type { IValidJSONLD } from "../types";

export interface ISoftwareApplicationJSONLD extends IValidJSONLD {
  "@type": "SoftwareApplication";
  name?: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  description: string;
}