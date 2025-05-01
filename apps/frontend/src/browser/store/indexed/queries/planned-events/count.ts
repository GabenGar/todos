import type { IIDBTransaction } from "../../types";

export function selectPlannedEventCount(
  transaction: IIDBTransaction<"planned_events">,
  onSuccess: (count: number) => void,
) {
  const objectStore = transaction.objectStore("planned_events");
  const countRequest = objectStore.count();

  countRequest.onsuccess = (event) => {
    const count = (event.target as typeof countRequest).result;

    onSuccess(count);
  };
}
