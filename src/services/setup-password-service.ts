/**
 * Setup Password API service for both regular users and client users.
 * Uses apiClient for consistent API communication.
 */

import { apiClient } from "@/lib/axios-config";
import type {
  SetupPasswordRequest,
  SetupPasswordResponseRegular,
  SetupPasswordResponseClient,
} from "@/types";

const REGULAR_USER_SETUP_PASSWORD_PATH = "/api/users/setup-password/";
const CLIENT_USER_SETUP_PASSWORD_PATH = "/api/clients/users/set-password/";

/**
 * Set up password for regular (internal) users.
 * Endpoint: POST /api/users/setup-password/
 */
export async function setupPasswordRegularUser(
  payload: SetupPasswordRequest
): Promise<SetupPasswordResponseRegular> {
  const { data } = await apiClient.post<SetupPasswordResponseRegular>(
    REGULAR_USER_SETUP_PASSWORD_PATH,
    payload
  );
  return data;
}

/**
 * Set up password for client (customer) users.
 * Endpoint: POST /api/clients/users/set-password/
 */
export async function setupPasswordClientUser(
  payload: SetupPasswordRequest
): Promise<SetupPasswordResponseClient> {
  const { data } = await apiClient.post<SetupPasswordResponseClient>(
    CLIENT_USER_SETUP_PASSWORD_PATH,
    payload
  );
  return data;
}

/**
 * Attempt to set up password by trying both endpoints.
 * First tries the regular user endpoint, if that fails with 404, tries the client endpoint.
 */
export async function setupPassword(
  payload: SetupPasswordRequest
): Promise<SetupPasswordResponseRegular | SetupPasswordResponseClient> {
  try {
    // Try regular user endpoint first
    return await setupPasswordRegularUser(payload);
  } catch (error: any) {
    // If the token is not found in the regular user endpoint (404), try client user endpoint
    if (error.response?.status === 404 || error.response?.status === 400) {
      return await setupPasswordClientUser(payload);
    }
    // If it's another error, re-throw it
    throw error;
  }
}
