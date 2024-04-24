import type { IEntityItem } from "#lib/entities";
import type { IPaginatedCollection } from "#lib/pagination";
import { ListLocal } from "#components/list";
import { createBlockComponent } from "#components/meta";
import type {
  IBaseComponentProps,
  ITranslatableProps,
} from "#components/types";

interface IProps<IEntityType extends IEntityItem>
  extends IBaseComponentProps<"div">,
    ITranslatableProps {
  fetchEntities: (page: number) => Promise<IPaginatedCollection<IEntityType>>;
}

export const Entitylist = createBlockComponent(undefined, Component);

function Component<IEntityType extends IEntityItem>({
  commonTranslation,
  fetchEntities,
  ...props
}: IProps<IEntityType>) {
  return (
    <div {...props}>
      <ListLocal
        commonTranslation={commonTranslation}
        pagination={pagination}
        onPageChange={(page) => page}
      />
    </div>
  );
}
