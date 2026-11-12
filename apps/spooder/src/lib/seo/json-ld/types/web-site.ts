import type { IValidJSONLD } from "../types";

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
