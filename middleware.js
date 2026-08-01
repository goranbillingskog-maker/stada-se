import { NextResponse } from "next/server";

const COOKIE_NAME = "stadtorget_admin";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtectedPage =
    pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isProtectedApi =
    pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const expected = process.env.ADMIN_SESSION_SECRET;
  const authed = Boolean(expected) && token === expected;

  if (authed) {
    return NextResponse.next();
  }

  if (isProtectedApi) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
