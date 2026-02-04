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
 * Auth API Types (Login – aligned with /api/token/ response)
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUserInfo {
  email: string;
  user_type: string;
  role: string;
  display_name: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user_info: LoginUserInfo;
}

/**
 * Setup Password API Types
 */
export interface SetupPasswordRequest {
  token: string;
  password: string;
  password_confirm: string;
}

export interface RegularUserInfo {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface ClientUserInfo {
  id: number;
  email: string;
  client_name: string;
  name: string;
}

export interface SetupPasswordResponseRegular {
  message: string;
  user: RegularUserInfo;
}

export interface SetupPasswordResponseClient {
  message: string;
  user: ClientUserInfo;
  activated_at: string;
}

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
  jobName: string;
  projectName: string;
  languages: string;
  sourceLang: string;
  targetLang: string;
  jobType: string;
  stage: string;
  segmentsReviewed: number;
  totalSegments: number;
  progressPercentage: number;
}

export interface CompletedJob {
  id: string | number;
  project: string;
  jobName: string;
  languages: string;
  sourceLang: string;
  targetLang: string;
  stage: string;
  completedRole: string;
  completedOn: string;
}

export interface CompletedJobSummaryStatistics {
  segmentsReviewed: number;
  finalErrors: number;
  criticalErrors: number;
  majorErrors: number;
  minorErrors: number;
}

export interface CompletedJobSegmentErrorCounts {
  critical: number;
  major: number;
  minor: number;
}

/** Single error from completed job segment (API: error_number, category, severity, rationale, comment). */
export interface CompletedJobSegmentError {
  id: number;
  category: string;
  severity: "Major" | "Minor" | "Critical";
  rationale: string;
  comment: string;
  firstReviewAction?: string | null;
  firstReviewRationale?: string | null;
  translatorAction?: string | null;
  translatorComment?: string | null;
  reviewer2Action?: string | null;
  reviewer2Comment?: string | null;
  arbitratorAction?: string | null;
  arbitratorComment?: string | null;
}

export interface CompletedJobSegment {
  segmentId: string;
  segmentOrder: number;
  status: string;
  previewText: string;
  sourceText: string;
  targetText: string;
  updatedTargetText: string;
  errorCounts: CompletedJobSegmentErrorCounts;
  errors: CompletedJobSegmentError[];
}

export interface CompletedJobDetail {
  id: string | number;
  jobName: string;
  projectName: string;
  languages: string;
  sourceLang: string;
  targetLang: string;
  status: string;
  summaryStatistics: CompletedJobSummaryStatistics;
  segments: CompletedJobSegment[];
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
  jobId: string;
  roleName: RoleName;
  initialSegmentOrder?: number;
}

export interface SegmentContentLeftProps {
  source: string;
  target: string;
  editedTarget: string;
  roleName: RoleName;
  onEditedTargetChange?: (text: string) => void;
}

export interface SegmentErrorsRightProps {
  errors: ErrorData[];
  roleName: RoleName;
  errorActions?: Record<number, "accept" | "reject" | "pending">;
  onAddError?: () => void;
  onEditError?: (
    errorId: number,
    updates: {
      category?: string;
      severity?: string;
      rationale?: string;
    }
  ) => void;
  onDeleteError?: (errorId: number) => void;
  onAgree?: (errorId: number) => void;
  onDisagree?: (errorId: number) => void;
  onKeep?: (errorId: number) => void;
  onDiscard?: (errorId: number) => void;
  onMarkResolved?: (errorId: number) => void;
  onIgnoreFeedback?: (errorId: number) => void;
  onAddComment?: (errorId: number, comment: string) => void;
  onAddNewError?: (error: ErrorData) => void;
  onDeleteNewError?: (errorId: number) => void;
}

export interface ErrorCardProps {
  error: ErrorData;
  currentAction?: "accept" | "reject" | "pending";
  onEdit?: () => void;
  onDelete?: () => void;
  onAgree?: () => void;
  onDisagree?: () => void;
  onKeep?: () => void;
  onDiscard?: () => void;
  onMarkResolved?: () => void;
  onIgnoreFeedback?: () => void;
  onAddComment?: (comment: string) => void;
}
