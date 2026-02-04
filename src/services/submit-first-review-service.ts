/**
 * Submit First Review API service.
 * Endpoint: POST /api/lqa/first-reviews/<job_id>/
 */

import { apiClient } from "@/lib/axios-config";

/**
 * Payload for submitting a first review (Reviewer 1).
 * Handles all scenarios: accept, reject, edit errors, add errors, and edit target.
 * Note: job_id is in the URL path, segment_id is in the payload.
 */
export interface SubmitFirstReviewPayload {
  ai_processing_result_id: number;
  segment_id: number;

  // Action for each error (1-3)
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

  // Optional free-text comments for each error (used by translator, arbitrator, etc.)
  // Mapped by error index (1-3) in the segment.
  comment_1?: string;
  comment_2?: string;
  comment_3?: string;

  // Edited target text (when user manually fixes translation)
  edited_target?: string;
}

/**
 * Response from first review submission.
 */
export interface SubmitFirstReviewResponse {
  success: boolean;
  message: string;
  segment_action: "accept" | "edit" | "pending";
  segment_id: number;
  updated_at: string;
}

/**
 * Submit a first review for a segment.
 *
 * @param jobId - The job ID
 * @param payload - The review payload with segment_order, actions and optional edits
 * @returns Response with segment action and status
 *
 * @example
 * // Scenario 1: Accept all AI errors
 * await submitFirstReview(353, {
 *   ai_processing_result_id: 7016,
 *   segment_id: 1,
 *   action_1: "accept",
 *   action_2: "accept",
 *   action_3: "pending"
 * });
 *
 * @example
 * // Scenario 2: Reject some errors (false positives)
 * await submitFirstReview(353, {
 *   ai_processing_result_id: 7016,
 *   segment_id: 1,
 *   action_1: "accept",
 *   action_2: "reject",
 *   action_3: "pending"
 * });
 *
 * @example
 * // Scenario 3: Edit error details
 * await submitFirstReview(353, {
 *   ai_processing_result_id: 7016,
 *   segment_id: 1,
 *   error_1_category: "Accuracy",
 *   error_1_severity: "Critical",
 *   rationale_1: "Product names do not follow the pattern",
 *   action_1: "accept",
 *   action_2: "reject",
 *   action_3: "pending"
 * });
 *
 * @example
 * // Scenario 4: Add new error
 * await submitFirstReview(353, {
 *   ai_processing_result_id: 7016,
 *   segment_id: 1,
 *   action_1: "accept",
 *   error_2_category: "Grammar",
 *   error_2_severity: "Major",
 *   rationale_2: "Missing article 'the' before noun",
 *   action_2: "accept",
 *   edited_target: "Fixed translation with proper grammar"
 * });
 *
 * @example
 * // Scenario 5: Edit target text
 * await submitFirstReview(353, {
 *   ai_processing_result_id: 7016,
 *   segment_id: 1,
 *   action_1: "accept",
 *   action_2: "reject",
 *   edited_target: "Hallo, ik ben Delong. In deze video kijken we naar ho"
 * });
 */
export async function submitFirstReview(
  jobId: string | number,
  payload: SubmitFirstReviewPayload
): Promise<SubmitFirstReviewResponse> {
  const { data } = await apiClient.post<SubmitFirstReviewResponse>(
    `/api/lqa/first-reviews/${jobId}/`,
    payload
  );

  return data;
}

/**
 * Submit the entire first review job (final submission).
 * Endpoint: POST /api/lqa/first-reviews/<job_id>/submit/
 *
 * @param jobId - The job ID
 * @returns Response indicating success
 *
 * @example
 * await submitFirstReviewJob(353);
 */
export async function submitFirstReviewJob(
  jobId: string | number
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.post<{ success: boolean; message: string }>(
    `/api/lqa/first-reviews/${jobId}/submit/`,
    {}
  );

  return data;
}
