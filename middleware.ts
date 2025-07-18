// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_LOCALE = "en";
const LOCALES = ["en", "de", "fr"];

// Only run on paths that do NOT start with a supported locale
export const config = {
  matcher: [
    /*
      Match anything that:
        - does NOT start with /api
        - does NOT start with /_next
        - does NOT start with /favicon.ico
        - does NOT already start with /<locale>
    */
    "/((?!api/|_next/|favicon.ico|images/|{en,de,fr}/).*)",
  ],
};

export function middleware(req: NextRequest) {
  const { pathname, search, origin } = req.nextUrl;
  const segments = pathname.split("/").filter(Boolean); 

  // If there is already a valid locale, do nothing
  if (segments[0] && LOCALES.includes(segments[0])) {
    return NextResponse.next();
  }

  // Otherwise redirect to default locale, preserving full path + query
  const newPath = `/${DEFAULT_LOCALE}${pathname}${search}`;
  return NextResponse.redirect(`${origin}${newPath}`);
}
