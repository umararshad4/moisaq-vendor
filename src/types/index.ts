import * as z from "zod";
import { setupPasswordSchema, signInSchema } from "@/utils/schema";

/**
 * Auth Form Values
 */
export type SetupPasswordValues = z.infer<typeof setupPasswordSchema>;
export type SignInValues = z.infer<typeof signInSchema>;

/**
 * Component Props
 */
export interface SetupPasswordFormProps {
  onSuccess?: () => void;
}

export interface WorkspaceReadyProps {
  onContinue?: () => void;
}
