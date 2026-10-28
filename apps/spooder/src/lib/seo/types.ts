import type { IElementType, IOneOrMany } from "@repo/ui/types";

const knownBaseMetaNames = new Set([
  "description",
  "application-name",
  "author",
  "color-scheme",
  "generator",
  "keywords",
  "referrer",
  "theme-color",
  "responsive-embedded-sizing",
  "text-scale",
  "viewport",
  "creator",
  "googlebot",
  "publisher",
  "robots",
] as const);

export type IKnownMetaName = IElementType<typeof knownBaseMetaNames>;

export function isKnownMetaName(input: unknown): input is IKnownMetaName {
  return knownBaseMetaNames.has(input as IKnownMetaName);
}

export interface ISEO {
  title?: IOneOrMany<string>;
  description?: IOneOrMany<IMetaTag>;
  applicationName?: IOneOrMany<IMetaTag>;
  unknownMetaTags: IUnknownMetaTag[];
}

export interface IMetaTag {
  name: IKnownMetaName;
  content?: string;
  unknownAttributes?: Map<string, undefined | IOneOrMany<undefined | string>>;
}

export interface IUnknownMetaTag
  extends Map<string, undefined | string | string[]> {}
