import type { IPagination } from "#lib/pagination";
import type { IPlannedEvent } from "#entities/planned-event";
import type { IIDBArgs } from "../../types";

interface IArgs extends IIDBArgs<"planned_events"> {
  pagination: IPagination;
  order?: "recently_created" | "recently_updated";
}

export function selectPlannedEventIDs(
  { transaction, pagination, order = "recently_created" }: IArgs,
  onSuccess: (ids: IPlannedEvent["id"][]) => void,
) {
  const { limit, offset } = pagination;
  const objectStore = transaction.objectStore("planned_events");
  const index = objectStore.index(order);
  const ids: IPlannedEvent["id"][] = [];
  // https://stackoverflow.com/a/22562756
  // cursor requires offset more than 0 to advance
  let isAdvancing = offset !== 0;

  const cursorRequest = index.openKeyCursor();

  cursorRequest.onsuccess = (event) => {
    const cursor = (event.target as typeof cursorRequest).result;

    // https://stackoverflow.com/a/25712778
    if (cursor && ids.length < limit) {
      if (isAdvancing === true) {
        cursor.advance(offset);
        isAdvancing = false;

        return;
      }

      const id = cursor.primaryKey as IPlannedEvent["id"];

      ids.push(id);
      cursor.continue();
    } else {
      if (ids.length === 0) {
        throw new Error(
          `No planned events exist for page ${pagination.currentPage}.`,
        );
      }

      onSuccess(ids);
    }
  };
}
