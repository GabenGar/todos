import type { INanoidID, ITitle } from "#lib/strings";

export interface IEntityItem {
  id: INanoidID;
  title?: ITitle;
}

export function toEntityItem<Type extends IEntityItem>(
  entity: Type,
): IEntityItem {
  const item: IEntityItem = { id: entity.id, title: entity.title };

  return item;
}
