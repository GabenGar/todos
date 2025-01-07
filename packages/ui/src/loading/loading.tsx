import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";

interface IProps extends IBaseComponentPropsWithChildren<"div"> {}

export const Loading = createBlockComponent(undefined, Component);

function Component({ children, ...props }: IProps) {
  return <div {...props}>{children ?? "Loading..."}</div>;
}
