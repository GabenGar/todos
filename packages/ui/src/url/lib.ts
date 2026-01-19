export function getPathnameSegments(
  input: string | URL | undefined,
): string[] | undefined {
  if (input === undefined) {
    return undefined;
  }

  const pathname = typeof input === "string" ? input : input.pathname;

  if (pathname === "/") {
    return undefined;
  }
  // remove leading and trailing forward slashes
  // so they wouldn't create empty segments
  const inputPathname = pathname.slice(
    1,
    pathname.endsWith("/") ? -1 : undefined,
  );

  const segments = inputPathname.split("/");

  if (segments.length === 0) {
    return undefined;
  }

  return segments;
}
