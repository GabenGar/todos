import { now } from "#lib/dates";
import { logDebug } from "#lib/logs";
import { createValidator } from "#lib/json/schema";
import { INanoidID, toQuotedStrings } from "#lib/strings";
import { setLocalStoreItem } from "#store/local";
import { IPlace, getAllPlaces } from "#entities/place";
import type { ITask, ITaskStore, ITaskUpdate } from "../types";
import { getAllTasks } from "./get";
import { toTasks } from "./to-tasks";

const validateTaskUpdate = createValidator<ITaskUpdate>(
  "/entities/task/update",
);

export async function editTask(update: ITaskUpdate): Promise<ITask> {
  const [editedTask] = await editTasks([update]);

  return editedTask;
}

/**
 * @param updates Incoming updates. It it assumed they have unique ids.
 * @returns The edited tasks.
 */
export async function editTasks(updates: ITaskUpdate[]): Promise<ITask[]> {
  logDebug(`Editing ${updates.length} tasks...`);

  updates.forEach((update) => validateTaskUpdate(update));

  // validate places
  const inputPlaceIDs = updates.reduce<Set<IPlace["id"]>>(
    (placeIDs, { place_id }) => {
      if (place_id) {
        placeIDs.add(place_id);
      }

      return placeIDs;
    },
    new Set(),
  );

  if (inputPlaceIDs.size) {
    const places = await getAllPlaces();
    const placeIDs = places.map(({ id }) => id);
    const invalidIDs = Array.from(inputPlaceIDs).reduce<INanoidID[]>(
      (invalidIDs, id) => {
        if (!placeIDs.includes(id)) {
          invalidIDs.push(id);
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

  const storedTasks = await getAllTasks();
  const updateIDs = new Set(updates.map(({ id }) => id));

  if (updateIDs.size !== updates.length) {
    throw new Error(
      `The amount of IDs (${updateIDs.size}) does not match the amount of updates (${updates.length}).`,
    );
  }

  const tasksWithUpdatedApplied = storedTasks.map<ITaskStore>((task) => {
    if (!updateIDs.has(task.id)) {
      return task;
    }

    // non-updates are filtered beforehand
    const update = updates.find(({ id }) => id === task.id)!;
    const updatedTitle = !update.title
      ? task.title
      : task.title !== update.title
        ? update.title
        : task.title;
    const updatedDescription = !update.description
      ? task.description
      : task.description !== update.description
        ? update.description
        : task.description;
    const updatedStatus = !update.status
      ? task.status
      : task.status !== update.status
        ? update.status
        : task.status;
    const updatedPlace = !update.place_id
      ? task.place
      : task.place !== update.place_id
        ? update.place_id
        : task.place;
    const updatedDeletionDate = update.deleted_at ?? task.deleted_at;
    const updatedTask: ITaskStore = {
      ...task,
      updated_at: now(),
      title: updatedTitle,
      description: updatedDescription,
      status: updatedStatus,
      deleted_at: updatedDeletionDate,
      place: updatedPlace,
    };

    return updatedTask;
  });

  setLocalStoreItem("todos", tasksWithUpdatedApplied);

  const inputTasks = tasksWithUpdatedApplied.filter(({ id }) =>
    updateIDs.has(id),
  );

  const editedTasks = await toTasks(inputTasks);

  logDebug(`Edited ${editedTasks.length} tasks.`);

  return editedTasks;
}
