import type { IValidJSONLD } from "../types";

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