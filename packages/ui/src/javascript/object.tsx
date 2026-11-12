import {
  DescriptionList,
  DescriptionSection,
  type IDescriptionListProps,
} from "#description-list";
import { createBlockComponent } from "#meta";
import { JavascriptValue } from "./value";

type IProps = IDescriptionListProps & {
  data: object;
};

export const JavascriptObject = createBlockComponent(undefined, Component);

function Component({ data, ...props }: IProps) {
  return (
    <DescriptionList {...props}>
      {Object.entries(data).map(([key, value]) => (
        <DescriptionSection
          key={key}
          dKey={key}
          dValue={<JavascriptValue data={value} />}
          isKeyPreformatted
        />
      ))}
    </DescriptionList>
  );
}
