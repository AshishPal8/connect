import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRouteType } from "./lib/routeAccess";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const isLoggedIn = !!token;

  const routeType = getRouteType(pathname);

  if (routeType === "guest" && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (routeType === "protected" && !isLoggedIn) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
