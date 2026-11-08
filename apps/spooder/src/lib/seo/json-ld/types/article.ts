import type { IValidJSONLD } from "../types";

export interface IArticleJSONLD extends IValidJSONLD {
  "@type": "Article";
  name?: string;
  url?: string;
  sameAs?: string;
  mainEntity?: string;
  author?: {
    "@type": "Organization";
    name?: string;
  };
  publisher?: {
    "@type": "Organization";
    name?: string;
    logo?: {
      "@type": "ImageObject";
      url?: string;
    };
  };
  datePublished?: string;
  dateModified?: string;
  image?: string;
  headline?: string;
}
