import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import { logDebug } from "#lib/logs";
import { createValidator, taskInitSchema } from "#lib/json/schema";
import { toQuotedStrings } from "#lib/strings";
import { setLocalStoreItem } from "#browser/local-storage";
import { type IPlace, getAllPlaces } from "#entities/place";
import type { ITask, ITaskInit, ITaskStore } from "../types";
import { getAllTasks } from "./get";
import { toTasks } from "./to-tasks";

export async function createTask(init: ITaskInit): Promise<ITask> {
  const [newTask] = await createTasks([init]);

  return newTask;
}

/**
 * @param inits
 * @returns Added tasks.
 */
async function createTasks(inits: ITaskInit[]): Promise<ITask[]> {
  logDebug(`Creating ${inits.length} tasks...`);

  const validate: Awaited<ReturnType<typeof createValidator<ITaskInit>>> =
    await createValidator(taskInitSchema.$id);

  inits.forEach((init) => {
    validate(init);
  });

  // validate place IDs
  const placeIDs = inits.reduce<Set<IPlace["id"]>>((placeIDs, { place_id }) => {
    if (place_id) {
      placeIDs.add(place_id);
    }

    return placeIDs;
  }, new Set());

  if (placeIDs.size) {
    const storedPlaces = await getAllPlaces();
    const inputIDs = storedPlaces.map(({ id }) => id);
    const invalidIDs = Array.from(placeIDs).reduce<IPlace["id"][]>(
      (invalidIDs, placeID) => {
        if (!inputIDs.includes(placeID)) {
          invalidIDs.push(placeID);
        }

        return invalidIDs;
      },
      [],
    );

    if (invalidIDs.length) {
      const message = `These places do not exist: ${toQuotedStrings(
        invalidIDs,
      )}.`;
      throw new Error(message);
    }
  }

  const incomingTasks = inits.map(
    ({ title, description, status, place_id }) => {
      const newTask: ITaskStore = {
        id: nanoid(),
        title,
        description,
        status: status ?? "pending",
        created_at: now(),
        updated_at: now(),
        place: place_id,
      };

      return newTask;
    },
  );

  const currentTasks = await getAllTasks();

  const newTasks = [...currentTasks, ...incomingTasks];
  setLocalStoreItem("todos", newTasks);
  const createdTasks = await toTasks(incomingTasks);

  logDebug(`Created ${inits.length} tasks.`);

  return createdTasks;
}
