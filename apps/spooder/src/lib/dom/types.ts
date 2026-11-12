import type { IOneOrMany } from "@repo/ui/types";

export interface IElementAttributeMapping
  extends Map<string, IOneOrMany<string>> {}
