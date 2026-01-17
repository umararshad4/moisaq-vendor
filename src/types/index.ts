/**
 * Type Definitions
 *
 * This directory contains all TypeScript type definitions and interfaces.
 * Types are shared across the application to ensure type safety.
 *
 * Pattern:
 * - One type file per domain/resource (e.g., user.ts, product.ts)
 * - Export types from index.ts for easy importing
 * - Use Zod schemas for runtime validation when needed
 * - Keep types focused and reusable
 *
 * Example:
 * ```typescript
 * // user.ts
 * export interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 *   role: 'admin' | 'user' | 'guest';
 *   createdAt: Date;
 *   updatedAt: Date;
 * }
 *
 * export type UserRole = User['role'];
 *
 * // Create DTO (Data Transfer Object)
 * export interface CreateUserDto {
 *   name: string;
 *   email: string;
 *   role?: UserRole;
 * }
 *
 * // Update DTO
 * export interface UpdateUserDto extends Partial<CreateUserDto> {
 *   id: string;
 * }
 * ```
 */
