import { INonNegativeInteger } from "#lib/numbers";
import { IPagination } from "#lib/pagination";
import { createBlockComponent } from "#components/meta";
import { IBaseComponentPropsWithChildren } from "#components/types";
import { List } from "./list";

interface IProps extends IBaseComponentPropsWithChildren<"div"> {
  pagination: IPagination;
  onPageChange: (nextPage: INonNegativeInteger) => Promise<void>;
}

export const ListInternal = createBlockComponent(undefined, Component);

function Component({ pagination, onPageChange, children, ...props }: IProps) {
  return (
    <div {...props}>
      <List>{children}</List>
    </div>
  );
}
