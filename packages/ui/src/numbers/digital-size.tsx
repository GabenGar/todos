import { type IPreformattedProps, Preformatted } from "#formatting";
import { useClient } from "#hooks";
import { Loading } from "#loading";
import { createBlockComponent } from "#meta";

interface IProps extends IPreformattedProps {
  size: number;
}

export const DigitalSize = createBlockComponent(undefined, Component);

function Component({ size, children, ...props }: IProps) {
  const client = useClient();

  return (
    <Preformatted date-size={String(size)} {...props}>
      {(children ?? !client) ? <Loading /> : client.formatDigitalSize(size)}
    </Preformatted>
  );
}
