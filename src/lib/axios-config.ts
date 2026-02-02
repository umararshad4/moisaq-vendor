/**
 * Base Axios instance for API requests.
 * Use this instance everywhere instead of raw axios so base URL, headers, and token are applied.
 *
 * - baseURL: from API_BASE_URL (same-origin /api, proxied to backend by proxy.ts)
 * - default headers: Content-Type, Accept
 * - request interceptor: adds Authorization Bearer token from storage when present
 */

import axios, { type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants";
import { getAuthCookie } from "@/lib/cookie";

/** Get auth token from cookie (access_token is stored in cookies). */
function getAuthToken(): string | null {
  return getAuthCookie();
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30_000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
