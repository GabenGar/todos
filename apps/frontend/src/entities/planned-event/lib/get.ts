import type { IPlannedEvent } from "../types";

export async function getPlannedEvents(): Promise<IPlannedEvent[]> {}

export async function getPlannedEvent(id: IPlannedEvent["id"]): Promise<IPlannedEvent> {}
