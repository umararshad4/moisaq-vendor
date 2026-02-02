/**
 * Completed jobs API service.
 * Endpoint: api/vendors/completed-tasks/
 * Returns paginated completed jobs.
 */

import { apiClient } from "@/lib/axios-config";
import type {
  CompletedJob,
  CompletedJobDetail,
  CompletedJobSegment,
  CompletedJobSegmentError,
  CompletedJobSummaryStatistics,
} from "@/types";

const COMPLETED_JOBS_PATH = "/api/vendors/completed-tasks/";

/** Raw API item – uses snake_case keys from API response. */
type CompletedJobRaw = Record<string, unknown> & {
  job_id?: string | number;
  project?: string;
  job_name?: string;
  languages?: string;
  source_language?: string;
  target_language?: string;
  stage?: string;
  completed_role?: string;
  completed_on?: string;
};

function toCompletedJob(raw: CompletedJobRaw): CompletedJob {
  // Parse languages string "EN → FR" to extract source and target
  const langMatch = (raw.languages as string)?.match(
    /(\w+(?:-\w+)?)\s*→\s*(\w+(?:-\w+)?)/
  );
  const sourceLang = langMatch?.[1] || (raw.source_language as string) || "";
  const targetLang = langMatch?.[2] || (raw.target_language as string) || "";

  return {
    id: raw.job_id ?? "",
    project: String(raw.project ?? ""),
    jobName: String(raw.job_name ?? ""),
    languages: String(raw.languages ?? ""),
    sourceLang: String(sourceLang),
    targetLang: String(targetLang),
    stage: String(raw.stage ?? ""),
    completedRole: String(raw.completed_role ?? ""),
    completedOn: String(raw.completed_on ?? ""),
  };
}

export interface CompletedJobsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CompletedJob[];
}

/**
 * Fetches completed jobs from the API with pagination support.
 * Returns both the paginated results and metadata for pagination.
 */
export async function getCompletedJobs(
  page: number = 1
): Promise<CompletedJobsResponse> {
  const { data } = await apiClient.get<{
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: CompletedJobRaw[];
  }>(COMPLETED_JOBS_PATH, {
    params: { page },
  });

  const rawResults = data.results ?? [];
  const completedJobs = rawResults.map(toCompletedJob);

  return {
    count: data.count ?? 0,
    next: data.next ?? null,
    previous: data.previous ?? null,
    results: completedJobs,
  };
}

/**
 * Completed job detail – raw API shapes.
 */
type CompletedJobDetailSummaryRaw = {
  segments_reviewed?: number;
  final_errors?: number;
  critical_errors?: number;
  major_errors?: number;
  minor_errors?: number;
};

type CompletedJobDetailSegmentErrorRaw = {
  error_number?: number;
  category?: string;
  severity?: string;
  rationale?: string | null;
  comment?: string | null;
};

type CompletedJobDetailSegmentRaw = {
  segment_id?: string | number;
  segment_order?: number;
  status?: string;
  preview_text?: string;
  source_text?: string;
  target_text?: string;
  updated_target_text?: string;
  error_counts?: {
    critical?: number;
    major?: number;
    minor?: number;
  };
  errors?: CompletedJobDetailSegmentErrorRaw[];
};

type CompletedJobDetailRaw = Record<string, unknown> & {
  job_id?: string | number;
  job_name?: string;
  project_name?: string;
  languages?: string;
  source_language?: string;
  target_language?: string;
  status?: string;
  summary_statistics?: CompletedJobDetailSummaryRaw;
  segments?: CompletedJobDetailSegmentRaw[];
};

function toSummaryStatistics(
  raw?: CompletedJobDetailSummaryRaw
): CompletedJobSummaryStatistics {
  return {
    segmentsReviewed: Number(raw?.segments_reviewed ?? 0),
    finalErrors: Number(raw?.final_errors ?? 0),
    criticalErrors: Number(raw?.critical_errors ?? 0),
    majorErrors: Number(raw?.major_errors ?? 0),
    minorErrors: Number(raw?.minor_errors ?? 0),
  };
}

const SEGMENT_SEVERITIES = ["Critical", "Major", "Minor"] as const;
type SegmentSeverity = (typeof SEGMENT_SEVERITIES)[number];

function normalizeSeverity(severity: string | undefined): SegmentSeverity {
  const s = String(severity ?? "").trim();
  const match = SEGMENT_SEVERITIES.find(
    (v) => v.toLowerCase() === s.toLowerCase()
  );
  return match ?? "Minor";
}

function toSegmentError(
  raw: CompletedJobDetailSegmentErrorRaw
): CompletedJobSegmentError {
  return {
    id: Number(raw.error_number ?? 0),
    category: String(raw.category ?? ""),
    severity: normalizeSeverity(raw.severity),
    rationale: String(raw.rationale ?? ""),
    comment: String(raw.comment ?? ""),
  };
}

function toCompletedJobSegment(
  raw: CompletedJobDetailSegmentRaw
): CompletedJobSegment {
  const sourceText = String(raw.source_text ?? "");
  const previewText =
    String(raw.preview_text ?? "").trim() ||
    (sourceText.length > 80 ? `${sourceText.slice(0, 80)}…` : sourceText);

  return {
    segmentId: String(raw.segment_id ?? ""),
    segmentOrder: Number(raw.segment_order ?? 0),
    status: String(raw.status ?? ""),
    previewText,
    sourceText,
    targetText: String(raw.target_text ?? ""),
    updatedTargetText: String(raw.updated_target_text ?? ""),
    errorCounts: {
      critical: Number(raw.error_counts?.critical ?? 0),
      major: Number(raw.error_counts?.major ?? 0),
      minor: Number(raw.error_counts?.minor ?? 0),
    },
    errors: (raw.errors ?? []).map(toSegmentError),
  };
}

/**
 * Fetches details for a single completed job.
 * Endpoint: /api/vendors/jobs/{job_id}/detail/
 */
export async function getCompletedJobDetail(
  jobId: string | number
): Promise<CompletedJobDetail> {
  const { data } = await apiClient.get<CompletedJobDetailRaw>(
    `/api/vendors/jobs/${jobId}/detail/`
  );

  // Parse languages string "EN → FR" to extract source and target
  const langMatch = (data.languages as string)?.match(
    /(\w+(?:-\w+)?)\s*→\s*(\w+(?:-\w+)?)/
  );
  const sourceLang = langMatch?.[1] || (data.source_language as string) || "";
  const targetLang = langMatch?.[2] || (data.target_language as string) || "";

  const summaryStatistics = toSummaryStatistics(data.summary_statistics);
  const segments = (data.segments ?? []).map(toCompletedJobSegment);

  return {
    id: data.job_id ?? jobId,
    jobName: String(data.job_name ?? ""),
    projectName: String(data.project_name ?? ""),
    languages: String(data.languages ?? ""),
    sourceLang: String(sourceLang),
    targetLang: String(targetLang),
    status: String(data.status ?? ""),
    summaryStatistics,
    segments,
  };
}
