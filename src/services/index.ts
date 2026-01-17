/**
 * API Services
 *
 * This directory contains all API-related service functions.
 * Services are responsible for making HTTP requests to external APIs.
 *
 * Pattern:
 * - One service file per API domain/resource
 * - Use TanStack Query hooks in src/hooks/ to consume these services
 * - Keep services simple and focused on data fetching/mutation
 * - Handle API errors appropriately
 *
 * Example:
 * ```typescript
 * import type { User } from '@/types/user';
 *
 * const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
 *
 * export const userService = {
 *   async getUsers(): Promise<User[]> {
 *     const response = await fetch(`${API_BASE_URL}/users`);
 *     if (!response.ok) throw new Error('Failed to fetch users');
 *     return response.json();
 *   },
 *
 *   async getUserById(id: string): Promise<User> {
 *     const response = await fetch(`${API_BASE_URL}/users/${id}`);
 *     if (!response.ok) throw new Error('Failed to fetch user');
 *     return response.json();
 *   },
 * };
 * ```
 */
