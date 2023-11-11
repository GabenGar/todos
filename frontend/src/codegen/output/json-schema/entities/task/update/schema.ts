/**
 * This module was generated automatically.
 * Do not edit it manually.
 */
export const schema = {
  $id: "/entities/task/update",
  title: "TaskUpdate",
  type: "object",
  additionalProperties: false,
  required: ["id"],
  minProperties: 2,
  properties: {
    id: {
      $ref: "/strings/nanoid",
    },
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
    deleted_at: {
      $ref: "/dates/datetime",
    },
    place_id: {
      $ref: "/strings/nanoid",
    },
  },
} as const;
