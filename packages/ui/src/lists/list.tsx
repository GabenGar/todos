import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";

import styles from "./list.module.scss";

export type IListProps =
  | ({ isOrdered?: false } & IUnorderedListProps)
  | ({ isOrdered: true } & IOrderedListProps);

export interface IUnorderedListProps
  extends IBaseComponentPropsWithChildren<"ul"> {}

export interface IOrderedListProps
  extends IBaseComponentPropsWithChildren<"ol"> {}

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
function ListUnorderedComponent({ ...props }: IUnorderedListProps) {
  return <ul {...props} />;
}
function ListOrderedComponent({ ...props }: IOrderedListProps) {
  return <ol {...props} />;
}

function ListItemComponent({ ...props }: IListItemProps) {
  return <li {...props} />;
}
