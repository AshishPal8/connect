import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRouteType } from "./lib/routeAccess";
import { decodeToken } from "./lib/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const isLoggedIn = !!token;

  const routeType = getRouteType(pathname);

  let isOnboarded = false;
  if (token) {
    const payload = await decodeToken(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("token");
      return response;
    }

    isOnboarded = payload.isOnboarded;
  }

  if (isOnboarded && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    isLoggedIn &&
    !isOnboarded &&
    pathname !== "/onboarding" &&
    !pathname.startsWith("/signin") &&
    !pathname.startsWith("/signup")
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

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
