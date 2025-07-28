import { createBlockComponent } from "@repo/ui/meta";
import { type IPreformattedProps, Preformatted } from "#formatting";

interface IProps extends IPreformattedProps {}

export const EntityDescription = createBlockComponent(undefined, Component);

function Component({ ...props }: IProps) {
  return <Preformatted {...props} />;
}
