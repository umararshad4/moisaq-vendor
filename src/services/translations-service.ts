/**
 * Translations API service.
 * Endpoint: GET /api/lqa/translations/:jobId/?page=1&page_size=200
 * Submit Endpoint: POST /api/lqa/translations/:jobId/
 * Submit Job Endpoint: POST /api/lqa/translations/:jobId/submit/
 */

import { apiClient } from "@/lib/axios-config";
import type {
  SubmitFirstReviewPayload,
  SubmitFirstReviewResponse,
} from "./submit-first-review-service";

// Re-export types for consumers
export type {
  SubmitFirstReviewPayload,
  SubmitFirstReviewResponse,
};

/** Raw segment item from translations API (snake_case). */
export interface TranslationSegmentRaw {
  id: number | null;
  job: number;
  segment_order: number;
  ai_processing_result_id: number;
  reviewer_name: string | null;
  action: string;
  action_display: string;
  segment_status: string;
  processing_status?: string;
  source_text: string;
  target_text: string;
  lqa_status?: string;
  edited_target: string;
  rationale?: string;
  rationale_1: string | null;
  rationale_2: string | null;
  rationale_3: string | null;
  error_1_category: string | null;
  error_1_severity: string | null;
  action_1: string | null;
  error_2_category: string | null;
  error_2_severity: string | null;
  action_2: string | null;
  error_3_category: string | null;
  error_3_severity: string | null;
  action_3: string | null;
  comment_1: string | null;
  comment_2: string | null;
  comment_3: string | null;
  reviewed_at: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Normalized segment for UI. */
export interface TranslationSegment {
  id: number | null;
  jobId: number;
  segmentOrder: number;
  aiProcessingResultId: number;
  reviewerName: string | null;
  action: string;
  actionDisplay: string;
  segmentStatus: string;
  processingStatus?: string;
  sourceText: string;
  targetText: string;
  lqaStatus?: string;
  editedTarget: string;
  rationale?: string;
  rationale1: string | null;
  rationale2: string | null;
  rationale3: string | null;
  error1Category: string | null;
  error1Severity: string | null;
  action1: string | null;
  error2Category: string | null;
  error2Severity: string | null;
  action2: string | null;
  error3Category: string | null;
  error3Severity: string | null;
  action3: string | null;
  comment1: string | null;
  comment2: string | null;
  comment3: string | null;
  reviewedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** Job info from translations response. */
export interface TranslationJobInfo {
  id: number;
  name: string;
  status: string;
  stages: string;
}

export interface TranslationsResponse {
  results: TranslationSegmentRaw[];
  next: string | null;
  previous: string | null;
  count: number;
  job_info: TranslationJobInfo;
}

function toTranslationSegment(raw: TranslationSegmentRaw): TranslationSegment {
  return {
    id: raw.id,
    jobId: raw.job,
    segmentOrder: raw.segment_order,
    aiProcessingResultId: raw.ai_processing_result_id,
    reviewerName: raw.reviewer_name,
    action: raw.action,
    actionDisplay: raw.action_display,
    segmentStatus: raw.segment_status,
    processingStatus: raw.processing_status,
    sourceText: raw.source_text ?? "",
    targetText: raw.target_text ?? "",
    lqaStatus: raw.lqa_status,
    editedTarget: raw.edited_target ?? "",
    rationale: raw.rationale,
    rationale1: raw.rationale_1 ?? null,
    rationale2: raw.rationale_2 ?? null,
    rationale3: raw.rationale_3 ?? null,
    error1Category: raw.error_1_category,
    error1Severity: raw.error_1_severity,
    action1: raw.action_1 ?? null,
    error2Category: raw.error_2_category,
    error2Severity: raw.error_2_severity,
    action2: raw.action_2 ?? null,
    error3Category: raw.error_3_category,
    error3Severity: raw.error_3_severity,
    action3: raw.action_3 ?? null,
    comment1: raw.comment_1 ?? null,
    comment2: raw.comment_2 ?? null,
    comment3: raw.comment_3 ?? null,
    reviewedAt: raw.reviewed_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

/**
 * Fetches translation segments for a job.
 */
export async function getTranslations(
  jobId: string | number,
  page: number = 1,
  pageSize: number = 200
): Promise<{
  segments: TranslationSegment[];
  jobInfo: TranslationJobInfo;
  count: number;
  next: string | null;
  previous: string | null;
}> {
  const { data } = await apiClient.get<TranslationsResponse>(
    `/api/lqa/translations/${jobId}/`,
    {
      params: { page, page_size: pageSize },
    }
  );

  const segments = (data.results ?? []).map(toTranslationSegment);

  return {
    segments,
    jobInfo: data.job_info ?? { id: 0, name: "", status: "", stages: "" },
    count: data.count ?? 0,
    next: data.next ?? null,
    previous: data.previous ?? null,
  };
}

/**
 * Submit a translation for a segment.
 * Endpoint: POST /api/lqa/translations/<job_id>/
 *
 * @param jobId - The job ID
 * @param payload - The translation payload with segment_id, actions and optional edits
 * @returns Response with segment action and status
 *
 * @example
 * await submitTranslation(353, {
 *   ai_processing_result_id: 7016,
 *   segment_id: 1,
 *   action_1: "accept",
 *   action_2: "reject"
 * });
 */
export async function submitTranslation(
  jobId: string | number,
  payload: SubmitFirstReviewPayload
): Promise<SubmitFirstReviewResponse> {
  const { data } = await apiClient.post<SubmitFirstReviewResponse>(
    `/api/lqa/translations/${jobId}/`,
    payload
  );

  return data;
}

/**
 * Submit the entire translation job (final submission).
 * Endpoint: POST /api/lqa/translations/<job_id>/submit/
 *
 * @param jobId - The job ID
 * @returns Response indicating success
 *
 * @example
 * await submitTranslationJob(353);
 */
export async function submitTranslationJob(
  jobId: string | number
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.post<{ success: boolean; message: string }>(
    `/api/lqa/translations/${jobId}/submit/`,
    {}
  );

  return data;
}
