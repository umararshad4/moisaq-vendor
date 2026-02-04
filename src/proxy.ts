/**
 * Next.js Proxy: runs before routes. Used to rewrite /api/* to the backend.
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 *
 * When API_BACKEND_URL is set, requests to /api/:path* are rewritten to the backend
 * so the client always calls same-origin /api/... and the backend URL stays server-only.
 *
 * Authorization:
 * - Auth routes: /setup-password, /sign-in, /forgot-password (only accessible when NOT logged in)
 * - Private routes: All other routes require auth_access cookie (only accessible when logged in)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const backendUrl = process.env.API_BACKEND_URL;

/** Auth routes that should only be accessible when NOT logged in */
const AUTH_ROUTES = ["/setup-password", "/sign-in", "/forgot-password"];

/** Default redirect for authenticated users trying to access auth routes */
const DASHBOARD_URL = "/dashboard";

/** Cookie key for access token */
const ACCESS_TOKEN_COOKIE = "auth_access";

/**
 * Check if a path is an auth route
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Authorization check for non-API routes
  if (!pathname.startsWith("/api")) {
    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE);
    const isLoggedIn = !!accessToken?.value;

    // If user is trying to access auth routes (sign-in, setup-password, etc.)
    if (isAuthRoute(pathname)) {
      // If already logged in, redirect to dashboard
      if (isLoggedIn) {
        return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
      }
      // If not logged in, allow access to auth routes
      return NextResponse.next();
    }

    // For all other routes (private routes), require authentication
    if (!isLoggedIn) {
      // Redirect to sign-in if no access token found
      const signInUrl = new URL("/sign-in", request.url);
      // Preserve the original destination for redirect after login
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }

  // API proxy logic
  if (!backendUrl) {
    return NextResponse.next();
  }

  // Strip leading /api and build backend URL (e.g. /api/users -> BACKEND_URL/users)
  const path = pathname.replace(/^\/api\/?/, "") || "";
  const search = request.nextUrl.search;
  const url = `${backendUrl.replace(/\/$/, "")}/${path}${search}`;

  return NextResponse.rewrite(new URL(url, request.url));
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
