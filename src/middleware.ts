import { type NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const url = new URL("/home", request.url);
  const response = NextResponse.redirect(url);

  return response;
}

/**
 * Configured matchers:
 *
 * - MUST start with `/`
 * - Can include named parameters: `/about/:path` matches `/about/a` and `/about/b` but not `/about/a/c`
 * - Can have modifiers on named parameters (starting with :): `/about/:path*` matches `/about/a/b/c` because `*` is zero or more. `?` is zero or one and `+` one or more
 * - Can use regular expression enclosed in parenthesis: `/about/(.*)` is the same as `/about/:path*`
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

const locales = ["en"] as const;
const defaultLocale = locales[0];

function getLocale(request: Request): string {
  const headers = Object.fromEntries(request.headers);
  const languages = new Negotiator({ headers }).languages();

  const locale = match(languages, locales, defaultLocale);

  return locale;
}
