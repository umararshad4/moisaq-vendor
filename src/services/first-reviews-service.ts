/**
 * First reviews API service.
 * Endpoint: GET /api/lqa/first-reviews/:jobId/?page=1&page_size=20
 */

import { apiClient } from "@/lib/axios-config";

/** Raw segment item from first-reviews API (snake_case). */
export interface FirstReviewSegmentRaw {
  id: number;
  job: number;
  segment_order: number;
  processing_status: string;
  source_text: string;
  target_text: string;
  lqa_status: string;
  edited_target: string;
  rationale: string;
  rationale_1: string | null;
  rationale_2: string | null;
  rationale_3: string | null;
  error_1_category: string | null;
  error_1_severity: string | null;
  error_2_category: string | null;
  error_2_severity: string | null;
  error_3_category: string | null;
  error_3_severity: string | null;
  created_at: string;
  updated_at: string;
}

/** Normalized segment for UI. */
export interface FirstReviewSegment {
  id: number;
  jobId: number;
  segmentOrder: number;
  processingStatus: string;
  sourceText: string;
  targetText: string;
  lqaStatus: string;
  editedTarget: string;
  rationale: string;
  rationale1: string | null;
  rationale2: string | null;
  rationale3: string | null;
  error1Category: string | null;
  error1Severity: string | null;
  error2Category: string | null;
  error2Severity: string | null;
  error3Category: string | null;
  error3Severity: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Job info from first-reviews response. */
export interface FirstReviewJobInfo {
  id: number;
  name: string;
  status: string;
  stages: string;
}

export interface FirstReviewsResponse {
  results: FirstReviewSegmentRaw[];
  next: string | null;
  previous: string | null;
  count: number;
  job_info: FirstReviewJobInfo;
}

function toFirstReviewSegment(raw: FirstReviewSegmentRaw): FirstReviewSegment {
  return {
    id: raw.id,
    jobId: raw.job,
    segmentOrder: raw.segment_order,
    processingStatus: raw.processing_status,
    sourceText: raw.source_text ?? "",
    targetText: raw.target_text ?? "",
    lqaStatus: raw.lqa_status ?? "",
    editedTarget: raw.edited_target ?? "",
    rationale: raw.rationale ?? "",
    rationale1: raw.rationale_1 ?? null,
    rationale2: raw.rationale_2 ?? null,
    rationale3: raw.rationale_3 ?? null,
    error1Category: raw.error_1_category,
    error1Severity: raw.error_1_severity,
    error2Category: raw.error_2_category,
    error2Severity: raw.error_2_severity,
    error3Category: raw.error_3_category,
    error3Severity: raw.error_3_severity,
    createdAt: raw.created_at ?? "",
    updatedAt: raw.updated_at ?? "",
  };
}

/**
 * Fetches first-reviews segments for a job.
 */
export async function getFirstReviews(
  jobId: string | number,
  page: number = 1,
  pageSize: number = 20
): Promise<{
  segments: FirstReviewSegment[];
  jobInfo: FirstReviewJobInfo;
  count: number;
  next: string | null;
  previous: string | null;
}> {
  const { data } = await apiClient.get<FirstReviewsResponse>(
    `/api/lqa/first-reviews/${jobId}/`,
    {
      params: { page, page_size: pageSize },
    }
  );

  const segments = (data.results ?? []).map(toFirstReviewSegment);

  return {
    segments,
    jobInfo: data.job_info ?? { id: 0, name: "", status: "", stages: "" },
    count: data.count ?? 0,
    next: data.next ?? null,
    previous: data.previous ?? null,
  };
}
