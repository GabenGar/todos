import { toQuotedString } from "#strings";
import type { IEntityItem } from "./types";

export function toEntityItem<Type extends IEntityItem>(
  entity: Type,
): IEntityItem {
  const item: IEntityItem = { id: entity.id, title: entity.title };

  return item;
}

export function parseTitle(title?: string, id?: string) {
  const parsedTitle = !title ? "Untitled" : toQuotedString(title);
  const finalTitle = `${parsedTitle}${!id ? "" : ` (${id})`}`;

  return finalTitle;
}

export function parseName(name?: string, id?: string) {
  const parsedName = !name ? "Unnamed" : toQuotedString(name);
  const finalName = `${parsedName}${!id ? "" : ` (${id})`}`;

  return finalName;
}
