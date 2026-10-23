import { type IPreformattedProps, Preformatted } from "#formatting";
import { createBlockComponent } from "#meta";
import { JavascriptObject } from "./object";

interface IProps extends IPreformattedProps {
  data: unknown;
}

export const JavascriptValue = createBlockComponent(undefined, Component);

function Component({ data, ...props }: IProps) {
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    // @ts-expect-error @TODO nuke `DescriptionList` `sections` prop
    return <JavascriptObject data={data}/>
  }

  return <Preformatted {...props}>{String(data)}</Preformatted>;
}
