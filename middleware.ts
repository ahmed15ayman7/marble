import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

function getRoleRedirect(role: string | undefined): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "SUPPLIER":
      return "/supplier/dashboard";
    case "CUSTOMER":
      return "/customer/dashboard";
    default:
      return "/auth/login";
  }
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role as string | undefined;

  const isAdminRoute = pathname.startsWith("/admin");
  const isSupplierRoute = pathname.startsWith("/supplier");
  const isCustomerRoute = pathname.startsWith("/customer");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname.startsWith("/auth");

  // Redirect legacy /dashboard
  if (isDashboardRoute) {
    if (!isLoggedIn)
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=" + encodeURIComponent(pathname), req.url));
    return NextResponse.redirect(new URL(getRoleRedirect(role), req.url));
  }

  // Protect /admin/** - ADMIN only
  if (isAdminRoute) {
    if (!isLoggedIn)
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=" + encodeURIComponent(pathname), req.url));
    if (role !== "ADMIN")
      return NextResponse.redirect(new URL(getRoleRedirect(role) || "/auth/login", req.url));
  }

  // Protect /supplier/** - SUPPLIER only
  if (isSupplierRoute) {
    if (!isLoggedIn)
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=" + encodeURIComponent(pathname), req.url));
    if (role !== "SUPPLIER")
      return NextResponse.redirect(new URL(getRoleRedirect(role) || "/auth/login", req.url));
  }

  // Protect /customer/** - CUSTOMER only
  if (isCustomerRoute) {
    if (!isLoggedIn)
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=" + encodeURIComponent(pathname), req.url));
    if (role !== "CUSTOMER")
      return NextResponse.redirect(new URL(getRoleRedirect(role) || "/auth/login", req.url));
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    const dest = getRoleRedirect(role);
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/supplier/:path*",
    "/customer/:path*",
    "/dashboard/:path*",
    "/auth/:path*",
  ],
};
