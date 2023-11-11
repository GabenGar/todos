/**
 * This module was generated automatically.
 * Do not edit it manually.
 */
export const schema = {
  $id: "/entities/data-export",
  title: "DataExport",
  type: "object",
  additionalProperties: false,
  required: ["version", "id", "created_at", "data"],
  properties: {
    version: {
      type: "integer",
      const: 1,
    },
    id: {
      $ref: "/strings/nanoid",
    },
    created_at: {
      $ref: "/dates/datetime",
    },
    data: {
      type: "object",
      additionalProperties: false,
      minProperties: 1,
      properties: {
        tasks: {
          type: "array",
          minLength: 1,
          items: {
            $ref: "/entities/task/entity",
          },
        },
        places: {
          type: "array",
          minLength: 1,
          items: {
            $ref: "/entities/place/entity",
          },
        },
      },
    },
  },
} as const;
