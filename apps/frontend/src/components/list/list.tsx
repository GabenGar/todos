import clsx from "clsx";
import { createBlockComponent } from "#components/meta";
import { type IOrderedListProps, OrderedList } from "./ordered";
import { type IUnorderedListProps, UnorderedList } from "./unordered";

import styles from "./list.module.scss";

export type IListProps = (
  | IUnorderedListProps
  | ({ isOrdered: true } & IOrderedListProps)
) & { isAlternating?: boolean };

export const List = createBlockComponent(styles, ListComponent);

function ListComponent(props: IListProps) {
  if ("isOrdered" in props) {
    const { isOrdered, isAlternating, className, ...listProps } = props;
    const finalClassName = clsx(className, isAlternating && styles.alternating);

    return <OrderedList className={finalClassName} {...listProps} />;
  }

  const { className, isAlternating, ...listProps } = props;
  const finalClassName = clsx(className, isAlternating && styles.alternating);

  return <UnorderedList className={finalClassName} {...listProps} />;
}
