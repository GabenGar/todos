import type { ReactNode } from "react";
import type { IOneOrMany } from "#types";
import { type IListProps, List, ListItem } from "./list";

interface IProps<Type> extends Pick<IListProps, "isOrdered"> {
  item: IOneOrMany<Type>;
  itemElement: (item: Type) => ReactNode;
}

export function OneOrManyItems<Type>({
  item,
  itemElement,
  isOrdered,
}: IProps<Type>) {
  return !Array.isArray(item) ? (
    itemElement(item)
  ) : (
    <List isOrdered={isOrdered}>
      {item.map((item, index) => (
        <ListItem key={index}>{itemElement(item)}</ListItem>
      ))}
    </List>
  );
}
