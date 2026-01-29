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

/**
 * Segment Types
 */
export type RoleName = "reviewer1" | "translator" | "reviewer2" | "arbitrator";

export type Severity = "Minor" | "Major" | "Critical";

export interface ErrorData {
  id: number;
  category: string;
  subcategory: string;
  severity: Severity;
  rationale: string;
  comment?: string;
  translatorFeedback?: string;
  reviewerFeedback?: string;
  isNew?: boolean;
}

export interface SegmentData {
  id: string;
  segmentNumber: number;
  source: string;
  target: string;
  editedTarget: string;
  errors: ErrorData[];
}

export interface ContextRow {
  index: number;
  source: string;
  target: string;
}

export interface TbMatchRow {
  sourceTerm: string;
  targetTerm: string;
}

export interface SegmentViewerProps {
  segmentId: string;
  roleName: RoleName;
}

export interface SegmentContentLeftProps {
  source: string;
  target: string;
  editedTarget: string;
  roleName: RoleName;
}

export interface SegmentErrorsRightProps {
  errors: ErrorData[];
  roleName: RoleName;
  onAddError?: () => void;
  onEditError?: (errorId: number) => void;
  onDeleteError?: (errorId: number) => void;
  onAgree?: (errorId: number) => void;
  onDisagree?: (errorId: number) => void;
  onKeep?: (errorId: number) => void;
  onDiscard?: (errorId: number) => void;
  onMarkResolved?: (errorId: number) => void;
  onIgnoreFeedback?: (errorId: number) => void;
  onAddComment?: (errorId: number) => void;
}

export interface ErrorCardProps {
  error: ErrorData;
  onEdit?: () => void;
  onDelete?: () => void;
  onAgree?: () => void;
  onDisagree?: () => void;
  onKeep?: () => void;
  onDiscard?: () => void;
  onMarkResolved?: () => void;
  onIgnoreFeedback?: () => void;
  onAddComment?: () => void;
}
