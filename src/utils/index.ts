/**
 * Utility Functions
 *
 * This directory contains reusable utility functions.
 * Utilities are pure functions that perform common operations.
 *
 * Pattern:
 * - Keep functions pure (no side effects)
 * - Export utilities from index.ts for easy importing
 * - Add JSDoc comments for complex functions
 * - Test utilities thoroughly
 *
 * Example:
 * ```typescript
 * import { clsx, type ClassValue } from 'clsx';
 * import { twMerge } from 'tailwind-merge';
 *
 * // Merge Tailwind CSS classes intelligently
 * export function cn(...inputs: ClassValue[]) {
 *   return twMerge(clsx(inputs));
 * }
 *
 * // Format date to localized string
 * export function formatDate(date: Date | string, locale = 'en-US'): string {
 *   const d = typeof date === 'string' ? new Date(date) : date;
 *   return new Intl.DateTimeFormat(locale).format(d);
 * }
 *
 * // Debounce function for performance
 * export function debounce<T extends (...args: any[]) => any>(
 *   func: T,
 *   wait: number
 * ): (...args: Parameters<T>) => void {
 *   let timeout: NodeJS.Timeout | null = null;
 *   return (...args: Parameters<T>) => {
 *     if (timeout) clearTimeout(timeout);
 *     timeout = setTimeout(() => func(...args), wait);
 *   };
 * }
 * ```
 */
