import { type IPreformattedProps, Preformatted } from "#formatting";
import { createBlockComponent } from "#meta";

interface IProps extends IPreformattedProps {
  error: Error;
}

export const ErrorView = createBlockComponent(undefined, Component);

function Component({ error, ...props }: IProps) {
  return <Preformatted {...props}>{String(error)}</Preformatted>;
}
