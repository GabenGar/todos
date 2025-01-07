import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";

import styles from "./list.module.scss";

type IListProps =
  | ({ isOrdered?: false } & IUnorderedListProps)
  | ({ isOrdered: true } & IOrderedListProps);

interface IUnorderedListProps extends IBaseComponentPropsWithChildren<"ul"> {}

interface IOrderedListProps extends IBaseComponentPropsWithChildren<"ol"> {}

export const List = createBlockComponent(styles.block, ListComponent);
const ListUnordered = createBlockComponent(
  styles.unordered,
  ListUnorderedComponent
);
const ListOrdered = createBlockComponent(styles.ordered, ListOrderedComponent);

function ListComponent({ ...props }: IListProps) {
  if (props.isOrdered) {
    const { isOrdered, ...listProps } = props;

    return <ListOrdered {...listProps} />;
  }

  const { isOrdered, ...listProps } = props;

  return <ListUnordered {...listProps} />;
}
function ListUnorderedComponent({ ...props }: IUnorderedListProps) {
  return <ul {...props} />;
}
function ListOrderedComponent({ ...props }: IOrderedListProps) {
  return <ol {...props} />;
}
