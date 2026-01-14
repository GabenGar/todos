import clsx from "clsx";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";

import styles from "./list.module.scss";

export type IListProps =
  | ({ isOrdered?: false } & IUnorderedListProps)
  | ({ isOrdered: true } & IOrderedListProps);

export interface IUnorderedListProps
  extends IBaseComponentPropsWithChildren<"ul"> {
  isNested?: boolean;
}

export interface IOrderedListProps
  extends IBaseComponentPropsWithChildren<"ol"> {
  isNested?: boolean;
}

interface IListItemProps extends IBaseComponentPropsWithChildren<"li"> {}

export const List = createBlockComponent(styles.block, ListComponent);
export const ListUnordered = createBlockComponent(
  styles.unordered,
  ListUnorderedComponent,
);
export const ListOrdered = createBlockComponent(
  styles.ordered,
  ListOrderedComponent,
);
export const ListItem = createBlockComponent(styles.item, ListItemComponent);

function ListComponent({ ...props }: IListProps) {
  if (props.isOrdered) {
    // biome-ignore lint/correctness/noUnusedVariables: it is excluded from props
    const { isOrdered, ...listProps } = props;

    return <ListOrdered {...listProps} />;
  }
  // biome-ignore lint/correctness/noUnusedVariables: it is excluded from props
  const { isOrdered, ...listProps } = props;

  return <ListUnordered {...listProps} />;
}
function ListUnorderedComponent({
  isNested,
  className,
  ...props
}: IUnorderedListProps) {
  const resolvedClassname = clsx(className, isNested && styles.nested);
  return <ul className={resolvedClassname} {...props} />;
}
function ListOrderedComponent({
  isNested,
  className,
  ...props
}: IOrderedListProps) {
  const resolvedClassname = clsx(className, isNested && styles.nested);
  return <ol className={resolvedClassname} {...props} />;
}

function ListItemComponent({ ...props }: IListItemProps) {
  return <li {...props} />;
}
