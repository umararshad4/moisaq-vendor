/**
 * Auth cookie helpers using cookies-next.
 * Stores access token, refresh token, and user_info from login response.
 */

import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { AUTH_COOKIE_KEYS } from "@/constants";
import type { LoginUserInfo } from "@/types";

const ACCESS_MAX_AGE_DAYS = 1;
const REFRESH_MAX_AGE_DAYS = 7;
const USER_INFO_MAX_AGE_DAYS = 7;

const cookieOptions = (maxAgeDays: number) => ({
  path: "/",
  maxAge: maxAgeDays * 24 * 60 * 60,
  sameSite: "lax" as const,
});

/**
 * Returns the access token from cookies (for API Authorization header).
 */
export function getAuthCookie(): string | null {
  const value = getCookie(AUTH_COOKIE_KEYS.ACCESS);
  return typeof value === "string" ? value : null;
}

/**
 * Returns the refresh token from cookies.
 */
export function getRefreshCookie(): string | null {
  const value = getCookie(AUTH_COOKIE_KEYS.REFRESH);
  return typeof value === "string" ? value : null;
}

/**
 * Returns parsed user_info from cookies, or null.
 */
export function getUserInfoCookie(): LoginUserInfo | null {
  const value = getCookie(AUTH_COOKIE_KEYS.USER_INFO);
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value) as LoginUserInfo;
  } catch {
    return null;
  }
}

/**
 * Stores access, refresh, and user_info from login response in cookies.
 */
export function setAuthCookies(
  access: string,
  refresh: string,
  userInfo: LoginUserInfo
): void {
  setCookie(
    AUTH_COOKIE_KEYS.ACCESS,
    access,
    cookieOptions(ACCESS_MAX_AGE_DAYS)
  );
  setCookie(
    AUTH_COOKIE_KEYS.REFRESH,
    refresh,
    cookieOptions(REFRESH_MAX_AGE_DAYS)
  );
  setCookie(
    AUTH_COOKIE_KEYS.USER_INFO,
    JSON.stringify(userInfo),
    cookieOptions(USER_INFO_MAX_AGE_DAYS)
  );
}

/**
 * Removes all auth cookies (e.g. on logout).
 */
export function clearAuthCookies(): void {
  deleteCookie(AUTH_COOKIE_KEYS.ACCESS, { path: "/" });
  deleteCookie(AUTH_COOKIE_KEYS.REFRESH, { path: "/" });
  deleteCookie(AUTH_COOKIE_KEYS.USER_INFO, { path: "/" });
}
