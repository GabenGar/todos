import type { ReactNode } from "react";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentProps } from "#components/types";
import { ListItem } from "./item";

export type IUnorderedListProps = IBaseComponentProps<"ul"> &
  ({ children: ReactNode } | { items: ReactNode[] });

export const UnorderedList = createBlockComponent(undefined, Component);

function Component(props: IUnorderedListProps) {
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
