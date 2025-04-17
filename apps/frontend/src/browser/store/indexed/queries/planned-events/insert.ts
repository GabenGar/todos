import { now, toJavascriptDate } from "#lib/dates";
import type { IPlannedEvent, IPlannedEventInit } from "#entities/planned-event";
import type { IIDBTransaction } from "../../types";
import type { IPlannedEventInitIDB } from "./types";

export function insertPlannedEvents(
  transaction: IIDBTransaction<"planned_events">,
  inits: IPlannedEventInit[],
  onSuccess: (ids: IPlannedEvent["id"][]) => void,
) {
  const timestamp = now();
  const idbInits = inits.map<IPlannedEventInitIDB>((init) => {
    const idbInit: IPlannedEventInitIDB = {
      ...init,
      created_at: timestamp,
      updated_at: timestamp,
      parsed_created_at: toJavascriptDate(timestamp),
      parsed_updated_at: toJavascriptDate(timestamp),
    };

    return idbInit;
  });
  const objectStore = transaction.objectStore("planned_events");

  const ids: IPlannedEvent["id"][] = [];

  // a note on multi-inserts:
  // https://stackoverflow.com/a/52555073
  // @TODO a better way to figure out IDs of inserted items
  // something along the lines of
  // getting count before and after insert
  // and fetch last X items
  idbInits.forEach((init, index) => {
    const addRequest = objectStore.add(init);

    addRequest.onsuccess = (event) => {
      const newKey = (event.target as typeof addRequest)
        .result as IPlannedEvent["id"];

      ids.push(newKey);

      if (index === inits.length - 1) {
        onSuccess(ids);
      }
    };
  });
}
