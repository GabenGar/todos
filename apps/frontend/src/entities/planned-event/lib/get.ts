import { type IIDBTransaction } from "#browser/store/indexed";
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
import type { IPlannedEvent } from "../types";

export function countPlannedEvents(
  transaction: IIDBTransaction<"planned_events">,
  onSuccess: (count: number) => void,
): void {
  selectPlannedEventCount(transaction, onSuccess);
}

export function getPlannedEvents(
  transaction: IIDBTransaction<"planned_events">,
  page: number | undefined,
  onSuccess: (plannedEvents: IPaginatedCollection<IPlannedEvent>) => void,
): void {
  selectPlannedEventCount(transaction, (count) => {
    const pagination = createClientPagination(count, PAGINATION_LIMIT, page);

    selectPlannedEventIDs(transaction, pagination, (ids) => {
      selectPlannedEventEntities(transaction, ids, (plannedEvents) => {
        const result: IPaginatedCollection<IPlannedEvent> = {
          pagination,
          items: plannedEvents,
        };

        onSuccess(result);
      });
    });
  });
}

export function getPlannedEvent(
  transaction: IIDBTransaction<"planned_events">,
  id: IPlannedEvent["id"],
  onSuccess: (plannedEvent: IPlannedEvent) => void,
): void {
  selectPlannedEventEntities(transaction, [id], ([plannedEvent]) =>
    onSuccess(plannedEvent),
  );
}
