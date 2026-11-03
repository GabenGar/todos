import type { IMaybe, IOneOrMany } from "@repo/ui/types";
import type { IKnownMetaName } from "./known-meta-names";

export interface ISEO {
  charSet?: IOneOrMany<string>;
  title?: IOneOrMany<string>;
  description?: IOneOrMany<IMetaTag>;
  applicationName?: IOneOrMany<IMetaTag>;
  author?: IOneOrMany<IMetaTag>;
  generator?: IOneOrMany<IMetaTag>;
  keywords?: IOneOrMany<IMetaTag>;
  referrer?: IOneOrMany<IMetaTag>;
  themeColor?: IOneOrMany<IMetaTag>;
  colorScheme?: IOneOrMany<IMetaTag>;
  responsiveEmbeddedSizing?: IOneOrMany<IMetaTag>;
  textScale?: IOneOrMany<IMetaTag>;
  viewport?: IOneOrMany<IMetaTag>;
  creator?: IOneOrMany<IMetaTag>;
  publisher?: IOneOrMany<IMetaTag>;
  googlebot?: IOneOrMany<IMetaTag>;
  robots?: IOneOrMany<IMetaTag>;
  openGraph?: IOpenGraph;
  // twitter?: ITwitterTags
  unknownMetaTags: IUnknownMetaTag[];
  invalidMetaTags: IInvalidMetaTag[];
}

export interface IOpenGraph {
  prefix?: string
  locale?: string
  alternateLocales?: string[]
  type?: string;
  siteName?: string;
  title?: string;
  description?: string;
  image?: {
    url?: string
    width?: string
    height?: string
    alt?: string
    type?: string
  }
  url?: string;
  unknownTags?: IOpenGraphMetaTag[];
}

export interface ITwitterTags {}

export interface IMetaTag {
  name: IKnownMetaName;
  content?: string;
  unknownAttributes?: Map<string, IMaybe<IOneOrMany<string>>>;
}

export interface IOpenGraphMetaTag {
  name?: string;
  property?: string;
  content?: string;
  unknownAttributes?: Map<string, IMaybe<IOneOrMany<string>>>;
}

export interface IUnknownMetaTag
  extends Map<string, undefined | string | string[]> {}

export interface IInvalidMetaTag
  extends Map<string, undefined | string | string[]> {}
