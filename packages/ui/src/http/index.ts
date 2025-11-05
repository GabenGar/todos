const HTTP_STATUS = {
  OK: {
    code: 200,
    title: "OK",
  },
  CREATED: { code: 201, title: "Created" },
  NO_CONTENT: { code: 204, title: "No Content" },
  MOVED_PERMANENTLY: { code: 301, title: "Moved Permanently" },
  FOUND: { code: 302, title: "Found" },
  SEE_OTHER: { code: 303, title: "See Other" },
  NOT_MODIFIED: { code: 304, title: "Not Modified" },
  TEMPORARY_REDIRECT: { code: 307, title: "Temporary Redirect" },
  PERMANENT_REDIRECT: { code: 308, title: "Permanent Redirect" },
  BAD_REQUEST: { code: 400, title: "Bad Request" },
  UNAUTHORIZED: { code: 401, title: "Unauthorized" },
  PAYMENT_REQUIRED: { code: 402, title: "Payment Required" },
  FORBIDDEN: { code: 403, title: "Forbidden" },
  NOT_FOUND: { code: 404, title: "Not Found" },
  METHOD_NOT_ALLOWED: { code: 405, title: "Method Not Allowed" },
  REQUEST_TIMEOUT: { code: 408, title: "Request Timeout" },
  CONFLICT: { code: 409, title: "Conflict" },
  GONE: { code: 410, title: "Gone" },
  IM_A_TEAPOT: { code: 418, title: "I'm a teapot" },
  UNPROCESSABLE_CONTENT: { code: 422, title: "Unprocessable Content" },
  TOO_MANY_REQUESTS: { code: 429, title: "Too Many Requests" },
  UNAVAILABLE_FOR_LEGAL_REASONS: {
    code: 451,
    title: "Unavailable For Legal Reasons",
  },
  INTERNAL_SERVER_ERROR: { code: 500, title: "Internal Server Error" },
  NOT_IMPLEMENTED: { code: 501, title: "Not Implemented" },
  BAD_GATEWAY: { code: 502, title: "Bad Gateway" },
  SERVICE_UNAVAILABLE: { code: 503, title: "Service Unavailable" },
  GATEWAY_TIMEOUT: { code: 504, title: "Gateway Timeout" },
} as const;

export const HTTP_STATUS_CODE = Object.entries(HTTP_STATUS).reduce(
  (httpStatus, [key, { code }]) => {
    // @ts-expect-error requires too much wrangling for "correct" type
    // due to `Object.entries()` casting keys to `string`
    httpStatus[key] = code;

    return httpStatus;
  },
  {} as {
    [Key in keyof typeof HTTP_STATUS]: (typeof HTTP_STATUS)[Key]["code"];
  },
);
