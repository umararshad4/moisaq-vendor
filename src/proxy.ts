/**
 * Next.js Proxy: runs before routes. Used to rewrite /api/* to the backend.
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 *
 * When API_BACKEND_URL is set, requests to /api/:path* are rewritten to the backend
 * so the client always calls same-origin /api/... and the backend URL stays server-only.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const backendUrl = process.env.API_BACKEND_URL;

export function proxy(request: NextRequest) {
  if (!backendUrl) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Strip leading /api and build backend URL (e.g. /api/users -> BACKEND_URL/users)
  const path = pathname.replace(/^\/api\/?/, "") || "";
  const search = request.nextUrl.search;
  const url = `${backendUrl.replace(/\/$/, "")}/${path}${search}`;

  return NextResponse.rewrite(new URL(url, request.url));
}

export const config = {
  matcher: "/api/:path*",
};
