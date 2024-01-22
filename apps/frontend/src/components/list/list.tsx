import type { ReactNode } from "react";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentProps } from "#components/types";
import { ListItem } from "./item";

import styles from "./list.module.scss";

type IListProps =
  | IUnorderedListProps
  | ({ isOrdered: true } & IOrderedListProps);
type IUnorderedListProps = IBaseComponentProps<"ul"> &
  ({ children: ReactNode } | { items: ReactNode[] });

type IOrderedListProps = IBaseComponentProps<"ol"> &
  ({ children: ReactNode } | { items: ReactNode[] });

export const List = createBlockComponent(styles, ListComponent);
const UnorderedList = createBlockComponent(undefined, UnorderedListComponent);
const OrderedList = createBlockComponent(undefined, OrderedListComponent);

function ListComponent(props: IListProps) {
  if ("isOrdered" in props) {
    const { isOrdered, ...listProps } = props;

    return <OrderedList {...listProps} />;
  }

  return <UnorderedList {...props} />;
}

function UnorderedListComponent(props: IUnorderedListProps) {
  if ("children" in props) {
    return <ul {...props} />;
  }

  const { items, ...restProps } = props;

  return (
    <ul {...restProps}>
      {items.map((item, index) => (
        <ListItem key={index}>{item}</ListItem>
      ))}
    </ul>
  );
}

function OrderedListComponent(props: IOrderedListProps) {
  if ("children" in props) {
    return <ol {...props} />;
  }

  const { items, ...restProps } = props;

  return (
    <ol {...restProps}>
      {items.map((item, index) => (
        <ListItem key={index}>{item}</ListItem>
      ))}
    </ol>
  );
}
