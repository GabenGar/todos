import type { ReactNode } from "react";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentProps } from "#components/types";
import { ListItem } from "./item";

export type IOrderedListProps = IBaseComponentProps<"ol"> &
  ({ children: ReactNode } | { items: ReactNode[] });

export const OrderedList = createBlockComponent(
  undefined,
  Component,
);

function Component(props: IOrderedListProps) {
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
