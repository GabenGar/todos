import { type IIDBArgs } from "#browser/store/indexed";
import {
  selectPlannedEventCount,
  selectPlannedEventEntities,
  selectPlannedEventIDs,
} from "#browser/store/indexed/queries/planned-events";
import {
  createClientPagination,
  PAGINATION_LIMIT,
  type IPaginatedCollection,
} from "#lib/pagination";
import type { IPlannedEvent, IPlannedEventOrder } from "../types";

interface ICountPlannedEventsArgs extends IIDBArgs<"planned_events"> {}

export function countPlannedEvents(
  { transaction }: ICountPlannedEventsArgs,
  onSuccess: (count: number) => void,
): void {
  selectPlannedEventCount(transaction, onSuccess);
}

interface IGetPlannedEventsArgs extends IIDBArgs<"planned_events"> {
  page?: number;
  order?: IPlannedEventOrder;
}

export function getPlannedEvents(
  { transaction, page, order }: IGetPlannedEventsArgs,
  onSuccess: (plannedEvents: IPaginatedCollection<IPlannedEvent>) => void,
): void {
  selectPlannedEventCount(transaction, (count) => {
    const pagination = createClientPagination(count, PAGINATION_LIMIT, page);

    selectPlannedEventIDs(transaction, pagination, (ids) => {
      selectPlannedEventEntities(
        { transaction, ids, order },
        (plannedEvents) => {
          const result: IPaginatedCollection<IPlannedEvent> = {
            pagination,
            items: plannedEvents,
          };

          onSuccess(result);
        },
      );
    });
  });
}

interface IGetPlannedEventArgs extends IIDBArgs<"planned_events"> {
  id: IPlannedEvent["id"];
}

export function getPlannedEvent(
  { transaction, id }: IGetPlannedEventArgs,
  onSuccess: (plannedEvent: IPlannedEvent) => void,
): void {
  selectPlannedEventEntities({ transaction, ids: [id] }, ([plannedEvent]) =>
    onSuccess(plannedEvent),
  );
}

export function isPlannedEventsOrder(
  input: unknown,
): input is IPlannedEventOrder {
  return input === "recently_created" || input === "recently_updated";
}
