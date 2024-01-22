import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";

interface IProps extends IBaseComponentPropsWithChildren<"li"> {}

export const ListItem = createBlockComponent(undefined, Component);

function Component(props: IProps) {
  return <li {...props} />;
}
