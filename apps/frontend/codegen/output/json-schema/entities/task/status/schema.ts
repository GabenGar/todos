/**
 * This module was generated automatically.
 * Do not edit it manually.
 */
export const schema = {
  $id: "/entities/task/status",
  title: "TaskStatus",
  anyOf: [
    {
      const: "pending",
      description: "The task is not being used.",
    },
    {
      const: "in-progress",
      description: "The task is currently ongoing.",
    },
    {
      const: "finished",
      description: "The task finished sucessfully.",
    },
    {
      const: "failed",
      description: "The task failed.",
    },
  ],
} as const;
