"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { IEntityItem } from "#lib/entities";
import {
  createClientPagination,
  type IPaginatedCollection,
} from "#lib/pagination";
import { ListLocal } from "#components/list";
import { createBlockComponent } from "#components/meta";
import type {
  IBaseComponentProps,
  ITranslatableProps,
} from "#components/types";
import { Loading } from "components/loading";

interface IProps<IEntityType extends IEntityItem>
  extends IBaseComponentProps<"div">,
    ITranslatableProps {
  fetchEntities: (
    serverPage: number,
  ) => Promise<IPaginatedCollection<IEntityType>>;
  mapEntity: (entity: IEntityType, index?: number) => ReactNode;
  limit?: number;
}

export const EntityList = createBlockComponent(undefined, Component);

function Component<IEntityType extends IEntityItem>({
  commonTranslation,
  fetchEntities,
  mapEntity,
  limit = 5,
  ...props
}: IProps<IEntityType>) {
  const [entityData, changeEntityData] =
    useState<Awaited<ReturnType<typeof fetchEntities>>>();

  useEffect(() => {
    fetchEntities(1).then((data) => {
      const { pagination, items } = data;
      const clientPagination = createClientPagination(
        pagination.totalCount,
        limit,
        1,
      );
      const clientItems = items.slice(clientPagination.offset, limit);
      const clientData: IPaginatedCollection<IEntityType> = {
        pagination: clientPagination,
        items: clientItems,
      };
      changeEntityData(clientData);
    });
  }, [limit]);

  async function handlePageChange(clientPage: number) {
    if (!entityData) {
      return;
    }

    const clientPagination = createClientPagination(
      entityData.pagination.totalCount,
      limit,
      1,
    );
  }

  return (
    <>
      {!entityData ? (
        <Loading />
      ) : entityData.pagination.totalCount === 0 ? (
        <p>{commonTranslation.list.no_items}</p>
      ) : (
        <ListLocal
          commonTranslation={commonTranslation}
          pagination={entityData.pagination}
          onPageChange={handlePageChange}
          {...props}
        >
          {entityData.items.map(mapEntity)}
        </ListLocal>
      )}
    </>
  );
}
