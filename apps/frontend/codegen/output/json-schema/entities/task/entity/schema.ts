/**
 * This module was generated automatically.
 * Do not edit it manually.
 */
export const schema = {
  $id: "/entities/task/entity",
  title: "Task",
  type: "object",
  additionalProperties: false,
  required: ["id", "created_at", "updated_at", "title"],
  properties: {
    id: {
      $ref: "/strings/nanoid",
    },
    created_at: {
      $ref: "/dates/datetime",
    },
    updated_at: {
      $ref: "/dates/datetime",
    },
    deleted_at: {
      $ref: "/dates/datetime",
    },
    title: {
      $ref: "/strings/title",
    },
    status: {
      $ref: "/entities/task/status",
    },
    description: {
      $ref: "/strings/description",
    },
    place: {
      $ref: "/strings/nanoid",
    },
  },
} as const;
