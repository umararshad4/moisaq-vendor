/**
 * Auth API service (login, etc.).
 * Uses apiClient; token from login is stored in cookie and applied by axios-config.
 */

import { apiClient } from "@/lib/axios-config";
import { setAuthCookies } from "@/lib/cookie";
import type { LoginResponse } from "@/types";
import type { SignInValues } from "@/types";

const AUTH_LOGIN_PATH = "/api/token/";

/**
 * Logs in with email and password.
 * On success, stores access, refresh, and user_info in cookies and returns the API response.
 */
export async function login(credentials: SignInValues): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    AUTH_LOGIN_PATH,
    credentials
  );

  setAuthCookies(data.access, data.refresh, data.user_info);
  return data;
}
