import { createBlockComponent } from "@repo/ui/meta";
import { Pre, type IPreProps } from "#components/pre";

interface IProps extends IPreProps {}

export const EntityDescription = createBlockComponent(undefined, Component);

function Component({ ...props }: IProps) {
  return <Pre {...props} />;
}
