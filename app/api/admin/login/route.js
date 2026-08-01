import { NextResponse } from "next/server";

const COOKIE_NAME = "stadtorget_admin";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { password } = body;

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      { error: "Admin är inte konfigurerad. Sätt ADMIN_PASSWORD och ADMIN_SESSION_SECRET i Vercel." },
      { status: 500 }
    );
  }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Fel lösenord" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, process.env.ADMIN_SESSION_SECRET, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
