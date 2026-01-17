/**
 * Application Constants
 *
 * This directory contains all constant values used across the application.
 * Constants are defined here to avoid magic strings/numbers in code.
 *
 * Pattern:
 * - Group constants by feature/domain
 * - Export constants from index.ts for easy importing
 * - Use descriptive names for constants
 * - Consider using enums for related sets of values
 *
 * Example:
 * ```typescript
 * export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
 *
 * export const PAGINATION = {
 *   DEFAULT_PAGE_SIZE: 20,
 *   MAX_PAGE_SIZE: 100,
 * } as const;
 *
 * export const STORAGE_KEYS = {
 *   AUTH_TOKEN: 'auth_token',
 *   USER_PREFERENCES: 'user_preferences',
 *   THEME: 'theme',
 * } as const;
 *
 * export const ROUTES = {
 *   HOME: '/',
 *   DASHBOARD: '/dashboard',
 *   PROFILE: '/profile',
 *   SETTINGS: '/settings',
 * } as const;
 *
 * export const USER_ROLES = {
 *   ADMIN: 'admin',
 *   USER: 'user',
 *   GUEST: 'guest',
 * } as const;
 *
 * export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
 * ```
 */
