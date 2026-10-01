import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUPPORTED_LOCALES } from "@shared/index";
import { resolvePreferredLocale } from "@/lib/locale";

const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const hasLocale = SUPPORTED_LOCALES.includes(firstSegment as (typeof SUPPORTED_LOCALES)[number]);

  if (hasLocale) {
    const response = NextResponse.next();
    const currentCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value;

    if (currentCookie !== firstSegment) {
      response.cookies.set(LOCALE_COOKIE_NAME, firstSegment, {
        path: "/",
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }

    return response;
  }

  const preferredLocale = resolvePreferredLocale({
    cookieLocale: request.cookies.get(LOCALE_COOKIE_NAME)?.value,
    acceptLanguage: request.headers.get("accept-language"),
  });

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE_NAME, preferredLocale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/:path*"],
};
