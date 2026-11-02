import type { ReactNode } from "react";
import type { IOneOrMany } from "#types";
import { List, ListItem } from "./list";

interface IProps<Type> {
  item: IOneOrMany<Type>;
  itemElement: (item: Type) => ReactNode;
}

export function OneOrManyItems<Type>({ item, itemElement }: IProps<Type>) {
  return !Array.isArray(item) ? (
    itemElement(item)
  ) : (
    <List>
      {item.map((item, index) => (
        <ListItem key={index}>{itemElement(item)}</ListItem>
      ))}
    </List>
  );
}
