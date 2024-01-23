import { createBlockComponent } from "#components/meta";
import { type IOrderedListProps, OrderedList } from "./ordered";
import { type IUnorderedListProps, UnorderedList } from "./unordered";

import styles from "./list.module.scss";

type IListProps =
  | IUnorderedListProps
  | ({ isOrdered: true } & IOrderedListProps);

export const List = createBlockComponent(styles, ListComponent);
function ListComponent(props: IListProps) {
  if ("isOrdered" in props) {
    const { isOrdered, ...listProps } = props;

    return <OrderedList {...listProps} />;
  }

  return <UnorderedList {...props} />;
}
