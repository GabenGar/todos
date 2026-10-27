import type { IOneOrMany } from "@repo/ui/types";

export interface ISEO {
  title?: IOneOrMany<string>;
  description?: IOneOrMany<string>
  metaTags: IMetaTag[];
}

export interface IMetaTag extends Map<string, string | string[]> {}
