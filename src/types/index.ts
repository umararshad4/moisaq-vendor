import * as z from "zod";
import {
  setupPasswordSchema,
  signInSchema,
  forgotPasswordSchema,
} from "@/utils/schema";

/**
 * Auth Form Values
 */
export type SetupPasswordValues = z.infer<typeof setupPasswordSchema>;
export type SignInValues = z.infer<typeof signInSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Component Props
 */
export interface SetupPasswordFormProps {
  onSuccess?: () => void;
}

export interface WorkspaceReadyProps {
  onContinue?: () => void;
}

/**
 * Job Types
 */
export interface ActiveJob {
  id: string | number;
  title: string;
  sourceLang: string;
  targetLang: string;
  type: string;
  completedSegments: number;
  totalSegments: number;
}
