/**
 * Reviewer2 API service.
 * Endpoint: GET /api/lqa/reviewer2/:jobId/?page=1&page_size=200
 * Submit Endpoint: POST /api/lqa/reviewer2/:jobId/
 * Submit Job Endpoint: POST /api/lqa/reviewer2/:jobId/submit/
 */

import { apiClient } from "@/lib/axios-config";

/** Raw segment item from reviewer2 API (snake_case). */
export interface Reviewer2SegmentRaw {
  id: number | null;
  job: number;
  segment_order: number;
  ai_processing_result_id?: number;
  reviewer_name?: string | null;
  reviewer2_name?: string | null;
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
  comment_1?: string | null;
  comment_2?: string | null;
  comment_3?: string | null;
  translator_action_1?: string | null;
  translator_comment_1?: string | null;
  translator_action_2?: string | null;
  translator_comment_2?: string | null;
  translator_action_3?: string | null;
  translator_comment_3?: string | null;
  reviewed_at: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Normalized segment for UI. */
export interface Reviewer2Segment {
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
  comment1?: string | null;
  comment2?: string | null;
  comment3?: string | null;
  translatorAction1?: string | null;
  translatorComment1?: string | null;
  translatorAction2?: string | null;
  translatorComment2?: string | null;
  translatorAction3?: string | null;
  translatorComment3?: string | null;
  reviewedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** Job info from reviewer2 response. */
export interface Reviewer2JobInfo {
  id: number;
  name: string;
  status: string;
  stages: string;
}

export interface Reviewer2Response {
  results: Reviewer2SegmentRaw[];
  next: string | null;
  previous: string | null;
  count: number;
  job_info: Reviewer2JobInfo;
}

function toReviewer2Segment(raw: Reviewer2SegmentRaw): Reviewer2Segment {
  return {
    id: raw.id,
    jobId: raw.job,
    segmentOrder: raw.segment_order,
    aiProcessingResultId: raw.ai_processing_result_id ?? 0,
    reviewerName: raw.reviewer2_name ?? raw.reviewer_name ?? null,
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
    translatorAction1: raw.translator_action_1 ?? null,
    translatorComment1: raw.translator_comment_1 ?? null,
    translatorAction2: raw.translator_action_2 ?? null,
    translatorComment2: raw.translator_comment_2 ?? null,
    translatorAction3: raw.translator_action_3 ?? null,
    translatorComment3: raw.translator_comment_3 ?? null,
    reviewedAt: raw.reviewed_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

/**
 * Fetches reviewer2 segments for a job.
 */
export async function getReviewer2(
  jobId: string | number,
  page: number = 1,
  pageSize: number = 200
): Promise<{
  segments: Reviewer2Segment[];
  jobInfo: Reviewer2JobInfo;
  count: number;
  next: string | null;
  previous: string | null;
}> {
  const { data } = await apiClient.get<Reviewer2Response>(
    `/api/lqa/reviewer2/${jobId}/`,
    {
      params: { page, page_size: pageSize },
    }
  );

  const segments = (data.results ?? []).map(toReviewer2Segment);

  return {
    segments,
    jobInfo: data.job_info ?? { id: 0, name: "", status: "", stages: "" },
    count: data.count ?? 0,
    next: data.next ?? null,
    previous: data.previous ?? null,
  };
}

/**
 * Payload for submitting a reviewer2 action.
 * For reviewer2, when adopting translator actions:
 * - "accept" means adopt the translator's action
 * - "reject" means hold/reject the translator's action
 */
export interface SubmitReviewer2Payload {
  ai_processing_result_id: number;
  segment_id: number;

  // Action for each error (1-3)
  // Note: For reviewer2, use "accept" (adopt translator) or "reject" (hold decision)
  action_1?: "accept" | "reject" | "pending";
  action_2?: "accept" | "reject" | "pending";
  action_3?: "accept" | "reject" | "pending";

  // Edited error details (when user modifies an error)
  error_1_category?: string;
  error_1_severity?: string;
  rationale_1?: string;

  error_2_category?: string;
  error_2_severity?: string;
  rationale_2?: string;

  error_3_category?: string;
  error_3_severity?: string;
  rationale_3?: string;

  // Optional free-text comments for each error
  comment_1?: string;
  comment_2?: string;
  comment_3?: string;

  // Edited target text (when user manually fixes translation)
  edited_target?: string;
}

/**
 * Response from reviewer2 submission.
 */
export interface SubmitReviewer2Response {
  success: boolean;
  message: string;
  segment_action: "accept" | "edit" | "pending";
  segment_id: number;
  updated_at: string;
}

/**
 * Submit a reviewer2 action for a segment.
 * Endpoint: POST /api/lqa/reviewer2/<job_id>/
 *
 * @param jobId - The job ID
 * @param payload - The reviewer2 payload with segment_id, actions and optional edits
 * @returns Response with segment action and status
 *
 * @example
 * // Accept translator's actions
 * await submitReviewer2(353, {
 *   ai_processing_result_id: 7016,
 *   segment_id: 1,
 *   action_1: "accept",
 *   action_2: "accept"
 * });
 *
 * @example
 * // Hold (reject) some translator actions
 * await submitReviewer2(353, {
 *   ai_processing_result_id: 7016,
 *   segment_id: 1,
 *   action_1: "accept",
 *   action_2: "reject"
 * });
 */
export async function submitReviewer2(
  jobId: string | number,
  payload: SubmitReviewer2Payload
): Promise<SubmitReviewer2Response> {
  const { data } = await apiClient.post<SubmitReviewer2Response>(
    `/api/lqa/reviewer2/${jobId}/`,
    payload
  );

  return data;
}

/**
 * Submit the entire reviewer2 job (final submission).
 * Endpoint: POST /api/lqa/reviewer2/<job_id>/submit/
 *
 * @param jobId - The job ID
 * @returns Response indicating success
 *
 * @example
 * await submitReviewer2Job(353);
 */
export async function submitReviewer2Job(
  jobId: string | number
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.post<{ success: boolean; message: string }>(
    `/api/lqa/reviewer2/${jobId}/submit/`,
    {}
  );

  return data;
}
