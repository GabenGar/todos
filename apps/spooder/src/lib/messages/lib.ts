import type { IMessage } from "./types";

export function createMessage(
  type: IMessage["type"],
  data: IMessage["data"],
): IMessage {
  // @ts-expect-error @TODO mapped types
  return {
    type,
    data,
  };
}

export function parseMessage<Type extends IMessage["type"]>(
  message: unknown,
  type: Type,
): IMessage["data"] {
  if (typeof message !== "object" || message === null) {
    throw new Error("Invalid message format.");
  }

  if (!("type" in message) || typeof message.type !== "string") {
    throw new Error("Message doesn't have a type.");
  }

  if (message.type !== type) {
    throw new Error(
      `Message type "${message.type}" doesn't match expected "${type}".`,
    );
  }

  if (!("data" in message)) {
    throw new Error("Message is missing a payload.");
  }

  switch (type) {
    case "error": {
      return message.data as IMessage["data"];
    }

    case "seo": {
      return message.data as IMessage["data"];
    }

    default: {
      throw new Error(`Unknown message type "${type}".`);
    }
  }
}
