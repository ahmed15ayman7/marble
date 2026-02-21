import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isAdmin = role === "ADMIN";

  const isAdminRoute     = pathname.startsWith("/admin");
  const isClientRoute    = pathname.startsWith("/dashboard");
  const isAuthRoute      = pathname.startsWith("/auth");

  // ── حماية مسارات الأدمن ──────────────────────────────────────────────
  if (isAdminRoute) {
    if (!isLoggedIn)
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=/admin", req.url));
    if (!isAdmin)
      return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ── حماية مسارات العميل ──────────────────────────────────────────────
  if (isClientRoute) {
    if (!isLoggedIn)
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=/dashboard", req.url));
  }

  // ── إعادة توجيه المستخدم المسجّل بالفعل من صفحات Auth ────────────────
  if (isAuthRoute && isLoggedIn) {
    const dest = isAdmin ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/auth/:path*"],
};
