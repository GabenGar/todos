import { type NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { DEFAULT_LOCALE, ILocale, LOCALES } from "#lib/internationalization";
import { logDebug } from "#lib/logs";

export async function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname, search, hash } = request.nextUrl;

  const pathnameIsMissingLocale = LOCALES.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    // e.g. incoming request is `/products`
    // The new URL is now `/en/products`
    const url = new URL(`/${locale}${pathname}${search}${hash}`, request.url);

    const redirect = NextResponse.redirect(url);

    return redirect;
  }
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
    // Optional: only run on root (/) URL
    "/",
  ],
};

function getLocale(request: Request): string {
  const headers = Object.fromEntries(request.headers);

  // look at the referer header
  if (headers.referer) {
    logDebug(`Referer for url "${request.url}": "${headers.referer}"`);
    const url = new URL(headers.referer);
    // get the locale value out of referer
    const [_, locale] = url.pathname.split("/");

    if (LOCALES.includes(locale as ILocale)) {
      return locale;
    }
  }

  const languages = new Negotiator({ headers }).languages();
  const locale = match(
    languages,
    // @ts-expect-error readonly type issue
    LOCALES,
    DEFAULT_LOCALE,
  );

  return locale;
}
