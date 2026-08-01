import { NextResponse } from "next/server";

const COOKIE_NAME = "stadtorget_admin";

function stripTrailingSlash(p) {
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

export function middleware(request) {
  const pathname = stripTrailingSlash(request.nextUrl.pathname);

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isProtectedPage = pathname.startsWith("/admin") && !isLoginPage;
  const isProtectedApi = pathname.startsWith("/api/admin") && !isLoginApi;

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

  if (isLoginPage) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
