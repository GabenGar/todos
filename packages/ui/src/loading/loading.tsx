import { useTranslation } from "#hooks";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";

interface IProps extends IBaseComponentPropsWithChildren<"div"> {}

export const Loading = createBlockComponent(undefined, Component);

function Component({ children, ...props }: IProps) {
  const { t } = useTranslation();

  return <div {...props}>{children ?? t((t) => t.loading.loading)}</div>;
}
