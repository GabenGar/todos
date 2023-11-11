/**
 * This module was generated automatically.
 * Do not edit it manually.
 */
export const schema = {
  $id: "/entities/task/stats",
  title: "TaskStatsAll",
  type: "object",
  additionalProperties: false,
  required: ["all", "pending", "in-progress", "finished", "failed"],
  properties: {
    all: {
      $ref: "/numbers/non-negative-integer",
    },
    pending: {
      $ref: "/numbers/non-negative-integer",
    },
    "in-progress": {
      $ref: "/numbers/non-negative-integer",
    },
    finished: {
      $ref: "/numbers/non-negative-integer",
    },
    failed: {
      $ref: "/numbers/non-negative-integer",
    },
  },
} as const;
