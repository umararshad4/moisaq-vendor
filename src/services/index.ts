/**
 * API Services
 *
 * This directory contains all API-related service functions.
 * Use the shared apiClient from @/lib/axios-config (base URL, headers, token) for all requests.
 *
 * Pattern:
 * - One service file per API domain/resource
 * - Use apiClient from @/lib/axios-config (do not use raw axios or fetch for API calls)
 * - Use TanStack Query hooks in src/hooks/ to consume these services
 * - Keep services simple and focused on data fetching/mutation
 * - Handle API errors appropriately
 *
 * Example:
 * ```typescript
 * import type { User } from '@/types/user';
 * import { apiClient } from '@/lib/axios-config';
 *
 * export const userService = {
 *   async getUsers(): Promise<User[]> {
 *     const { data } = await apiClient.get<User[]>('/users');
 *     return data;
 *   },
 *
 *   async getUserById(id: string): Promise<User> {
 *     const { data } = await apiClient.get<User>(`/users/${id}`);
 *     return data;
 *   },
 * };
 * ```
 */

export { apiClient } from "@/lib/axios-config";
export { login } from "./auth-service";
export { getActiveJobs } from "./vendors-service";
export {
  getCompletedJobs,
  getCompletedJobDetail,
} from "./completed-jobs-service";
export { getNotifications, acceptNotification } from "./notifications-service";
export { getFirstReviews } from "./first-reviews-service";
export { getTermBaseMatches } from "./term-base-service";
export { getFileData } from "./file-data-service";
