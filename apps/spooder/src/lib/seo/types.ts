import type { IOneOrMany } from "@repo/ui/types";
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
  unknownMetaTags: IUnknownMetaTag[];
  invalidMetaTags: IInvalidMetaTag[];
}

export interface IMetaTag {
  name: IKnownMetaName;
  content?: string;
  unknownAttributes?: Map<string, undefined | IOneOrMany<undefined | string>>;
}

export interface IUnknownMetaTag
  extends Map<string, undefined | string | string[]> {}

export interface IInvalidMetaTag
  extends Map<string, undefined | string | string[]> {}
