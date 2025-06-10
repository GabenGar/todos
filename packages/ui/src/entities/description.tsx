import { createBlockComponent } from "@repo/ui/meta";
import { Preformatted, type IPreformattedProps } from "#formatting";

interface IProps extends IPreformattedProps {}

export const EntityDescription = createBlockComponent(undefined, Component);

function Component({ ...props }: IProps) {
  return <Preformatted {...props} />;
}
