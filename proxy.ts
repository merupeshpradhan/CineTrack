import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 🔒 List your app paths that require a user to be logged in
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    // ✅ FIXED: Check for 'refreshToken' to match your verify-otp endpoint setup
    const hasRefreshToken = request.cookies.has("refreshToken");

    if (!hasRefreshToken) {
      console.log(
        `🔒 [Proxy Intercept] No session found for ${pathname}. Redirecting to login.`,
      );
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};
