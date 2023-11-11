/**
 * This module was generated automatically.
 * Do not edit it manually.
 */
export const schema = {
  $id: "/entities/task/init",
  title: "TaskInit",
  type: "object",
  additionalProperties: false,
  required: ["title"],
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 256,
    },
    status: {
      $ref: "/entities/task/status",
    },
    description: {
      type: "string",
      minLength: 1,
      maxLength: 2048,
    },
    place_id: {
      $ref: "/strings/nanoid",
    },
  },
} as const;
