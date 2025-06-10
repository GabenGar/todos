import { toQuotedString } from "#strings";
import type { IEntityItem } from "./types";

export function toEntityItem<Type extends IEntityItem>(
  entity: Type
): IEntityItem {
  const item: IEntityItem = { id: entity.id, title: entity.title };

  return item;
}

export function parseTitle(title?: string) {
  return title ? toQuotedString(title) : "Untitled";
}

export function parseName(name?: string) {
  return name ? toQuotedString(name) : "Unnamed";
}
